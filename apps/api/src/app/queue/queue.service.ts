import { Injectable } from '@nestjs/common';
import { ChargingStationService } from '../charging-station/charging-station.service';
import { ChargingSessionService } from '../charging-session/charging-session.service';
import { ChargingSession } from '../charging-session/charging-session';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface QueuedUser {
  userId: string;
  priority: number;
}

const MAX_SESSION_DURATION = 8;
const MAX_QUEUE_SIZE = 10;

@Injectable()
export class QueueService {
  private readonly queue: QueuedUser[] = [];
  private priorityCount = 1;

  constructor(
    private readonly chargingStationService: ChargingStationService,
    private readonly sessionService: ChargingSessionService,
    private readonly usersService: UsersService
  ) {}

  async addToQueue(userId: string) {
    const existing = this.queue.filter((user) => user.userId === userId);
    if (existing.length > 0) {
      throw new Error('Already in queue.');
    }
    if (this.queue.length === MAX_QUEUE_SIZE) {
      throw new Error('Queue full.');
    }
    const activeSession =
      await this.sessionService.activeSessionExistsForUserId(userId);
    if (activeSession) {
      throw new Error('Active session is in progress for user.');
    }
    this.queue.push({ userId, priority: this.priorityCount++ });
  }

  getNextInQueue(): QueuedUser {
    this.queue.sort((a, b) => b.priority - a.priority);
    return this.queue.pop();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processQueue() {
    const stations =
      await this.chargingStationService.getAvailableChargingStations();
    for (const station of stations) {
      const next = this.getNextInQueue();
      if (next) {
        const now = new Date();
        const newSession = new ChargingSession();
        const user = await this.usersService.findOne(next.userId);
        newSession.user = user;
        newSession.chargingStation = Promise.resolve(station);
        newSession.startTime = now;
        newSession.endTime = new Date(
          now.getTime() + MAX_SESSION_DURATION * 60 * 60 * 1000
        );
        newSession.reserved = false;
        return this.sessionService.saveChargingSession(newSession);
      }
      // skip looping if there is no one in the queue.
      return;
    }
  }
}
