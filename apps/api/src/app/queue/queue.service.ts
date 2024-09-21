import { Injectable } from '@nestjs/common';
import { ChargingStationService } from '../charging-station/charging-station.service';
import { ChargingStationStatus } from '../charging-station/charging-station-status.enum';
import { ChargingSessionService } from '../charging-session/charging-session.service';
import { ChargingSession } from '../charging-session/charging-session';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface QueuedUser {
  userId: number;
  priority: number;
}

@Injectable()
export class QueueService {
  private readonly queue: QueuedUser[] = [];
  private priorityCount = 0;

  constructor(
    private readonly chargingStationService: ChargingStationService,
    private readonly sessionService: ChargingSessionService,
    private readonly usersService: UsersService
  ) {}

  addToQueue(userId: number) {
    const id = this.queue.filter((user) => user.userId === userId);
    if (id.length > 0) {
      throw new Error('Already in queue.');
    }
    this.queue.push({ userId, priority: this.priorityCount++ });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processQueue() {
    const stations = await this.chargingStationService.getChargingStations();
    const freeStations = stations.filter(
      (station) => station.status === ChargingStationStatus.FREE
    );
    for (const free of freeStations) {
      const next = this.queue.pop();
      if (next) {
        const now = new Date();
        const newSession = new ChargingSession();
        const user = await this.usersService.findOne(next.userId);
        newSession.user = user;
        newSession.chargingStation = free;
        newSession.startTime = now;
        // Set endTime to the startTime of the next session in line.
        const s = free.chargingSessions
          .filter((session) => session.startTime > now)
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
          .pop();
        if (s) {
          newSession.endTime = s.startTime;
        }
        newSession.reserved = false;
        return this.sessionService.saveChargingSession(newSession);
        // TODO: Delete QueuedUser.
      }
      // skip looping if there is no one in the queue.
      return;
    }
  }
}
