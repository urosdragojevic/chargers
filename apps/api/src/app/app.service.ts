import { Injectable } from '@nestjs/common';
import { AddChargingStationDto } from './app.controller';
import { UsersService } from './users/users.service';
import { ChargingStationService } from './charging-station/charging-station.service';
import { ChargingSessionService } from './charging-session/charging-session.service';
import { ChargingSessionDto } from './charging-session/charging-session.dto';
import { ChargingSession } from './charging-session/charging-session';
import { ChargingStation } from './charging-station/charging-station';
import { ChargingStationStatus } from './charging-station/charging-station-status.enum';
import { QueueService } from './queue/queue.service';

@Injectable()
export class AppService {
  constructor(
    private readonly chargingStationsService: ChargingStationService,
    private readonly chargingSessionService: ChargingSessionService,
    private readonly usersService: UsersService,
    private readonly queueService: QueueService
  ) {}

  getChargingStations(location?: string) {
    return this.chargingStationsService.getChargingStations(location);
  }

  addChargingStation(dto: AddChargingStationDto) {
    const station = new ChargingStation();
    station.location = dto.location;
    return this.chargingStationsService.createChargingStation(station);
  }

  async enterQueue(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    return this.queueService.addToQueue(userId);
  }

  async saveChargingSession(chargingSessionDto: ChargingSessionDto) {
    const user = await this.usersService.findOne(chargingSessionDto.userId);
    const chargingStation = await this.chargingStationsService.getById(
      chargingSessionDto.chargingStationId
    );
    const chargingSession = new ChargingSession();
    chargingSession.user = user;
    chargingSession.chargingStation = Promise.resolve(chargingStation);
    chargingSession.startTime = chargingSessionDto.startTime;
    chargingSession.endTime = chargingSessionDto.endTime;
    return this.chargingSessionService.saveChargingSession(chargingSession);
  }

  getChargingSessions(chargingStationId?: string) {
    return this.chargingSessionService.getChargingSessions(chargingStationId);
  }

  async endChargingSession(id: number, userId: string) {
    const session = await this.chargingSessionService.getById(id);
    if (!session) {
      throw new Error('Charging session does not exist.');
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    if (!session.isUser(user)) {
      throw new Error('Charging session does not belong to user.');
    }
    const now = new Date();
    const isActiveSession =
      session.startTime < now &&
      (now < session.endTime || session.endTime === null);
    if (!isActiveSession) {
      throw new Error('Cannot end non-active session.');
    }
    session.endTime = now;
    const chargingStation = await session.chargingStation;
    chargingStation.status = ChargingStationStatus.FREE;
    await this.chargingStationsService.createChargingStation(chargingStation);
    return this.chargingSessionService.saveChargingSession(session);
  }

  getQueue() {
    return this.queueService.getQueue();
  }
}
