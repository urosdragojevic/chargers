import { Injectable } from '@nestjs/common';
import {
  AddChargingStationDto,
  ReserveSessionDto,
  StartChargingSessionDto,
} from './app.controller';
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
    chargingSession.reserved = chargingSessionDto.reserved;
    return this.chargingSessionService.saveChargingSession(chargingSession);
  }

  getChargingSessions(chargingStationId?: string) {
    return this.chargingSessionService.getChargingSessions(chargingStationId);
  }

  async startChargingSession(userId: string, dto: StartChargingSessionDto) {
    const chargingStation = await this.chargingStationsService.getById(
      dto.chargingStationId
    );
    const sessions = await chargingStation.chargingSessions;
    const now = new Date();
    if (sessions.length > 0) {
      const isActiveSession = sessions
        .map((session) => {
          return (
            session.startTime < now &&
            (now < session.endTime || session.endTime === null)
          );
        })
        .includes(true);
      if (isActiveSession) {
        throw new Error(
          'Session is already in progress, cannot create charging session.'
        );
        // TODO: add to queue?
      }
    }
    const newSession = new ChargingSession();
    const user = await this.usersService.findOne(userId);
    newSession.user = user;
    newSession.chargingStation = Promise.resolve(chargingStation);
    newSession.startTime = now;
    // Set endTime to the startTime of the next session in line.
    const s = sessions
      .filter((session) => session.startTime > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .pop();
    if (s) {
      newSession.endTime = s.startTime;
    }
    newSession.reserved = false;
    chargingStation.status = ChargingStationStatus.IN_USE;
    await this.chargingStationsService.createChargingStation(chargingStation);
    return this.chargingSessionService.saveChargingSession(newSession);
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

  async reserveSession(dto: ReserveSessionDto) {
    const chargingStation = await this.chargingStationsService.getById(
      dto.chargingStationId
    );
    const sessions = await chargingStation.chargingSessions;
    const newSession = new ChargingSession();
    const user = await this.usersService.findOne(dto.userId);
    newSession.user = user;
    newSession.chargingStation = Promise.resolve(chargingStation);
    newSession.startTime = dto.startTime;
    newSession.endTime = dto.endTime;
    newSession.reserved = true;
    const isActiveSession = sessions
      .map((session) => session.isActive(newSession))
      .includes(true);
    if (isActiveSession) {
      throw new Error(
        'Session is already in progress, cannot reserve charging session.'
      );
      // TODO: add to queue?
    }
    return this.chargingSessionService.saveChargingSession(newSession);
  }

  getQueue() {
    return this.queueService.getQueue();
  }
}
