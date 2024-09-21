import { Injectable } from '@nestjs/common';
import {
  AddChargingStationDto,
  StartChargingSessionDto,
} from './app.controller';
import { UsersService } from './users/users.service';
import { ChargingStationService } from './charging-station/charging-station.service';
import { ChargingSessionService } from './charging-session/charging-session.service';
import { ChargingSessionDto } from './charging-session/charging-session.dto';
import { ChargingSession } from './charging-session/charging-session';
import { ChargingStation } from './charging-station/charging-station';

const QUEUE_CAPACITY = 5;

@Injectable()
export class AppService {
  constructor(
    private readonly chargingStationsService: ChargingStationService,
    private readonly chargingSessionService: ChargingSessionService,
    private readonly usersService: UsersService
  ) {}

  getChargingStations() {
    return this.chargingStationsService.getChargingStations();
  }

  addChargingStation(dto: AddChargingStationDto) {
    const station = new ChargingStation();
    station.location = dto.location;
    return this.chargingStationsService.createChargingStation(station);
  }

  async enterQueue(id: number, userId: number) {
    // const user = await this.usersService.findOne(userId);
    // if (!user) {
    //   throw new Error('User not found.');
    // }
    // const station = await this.chargingStationsService.getById(id);
    // if (!station.queue) {
    //   station.queue = [];
    // }
    // if (station.queue.length >= QUEUE_CAPACITY) {
    //   throw new Error('Queue full.');
    // }
    // if (station.queue.includes(user)) {
    //   throw new Error('Already in queue');
    // }
    // station.queue.push(user);
    // this.chargingStationsService.createChargingStation(station);
  }

  async saveChargingSession(chargingSessionDto: ChargingSessionDto) {
    const user = await this.usersService.findOne(chargingSessionDto.userId);
    const chargingStation = await this.chargingStationsService.getById(
      chargingSessionDto.chargingStationId
    );
    const chargingSession = new ChargingSession();
    chargingSession.user = user;
    chargingSession.chargingStation = chargingStation;
    chargingSession.startTime = chargingSessionDto.startTime;
    chargingSession.endTime = chargingSessionDto.endTime;
    chargingSession.reserved = chargingSessionDto.reserved;
    return this.chargingSessionService.saveChargingSession(chargingSession);
  }

  getChargingSessions(chargingStationId: number) {
    return this.chargingSessionService.getChargingSessions(chargingStationId);
  }

  async startChargingSession(dto: StartChargingSessionDto) {
    const chargingStation = await this.chargingStationsService.getById(
      dto.chargingStationId
    );
    const sessions = chargingStation.chargingSessions;
    const now = new Date();
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
    const newSession = new ChargingSession();
    const user = await this.usersService.findOne(dto.userId);
    newSession.user = user;
    newSession.chargingStation = chargingStation;
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
    return this.chargingSessionService.saveChargingSession(newSession);
  }
}
