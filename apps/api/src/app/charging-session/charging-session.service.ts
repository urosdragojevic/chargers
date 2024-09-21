import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargingSession } from './charging-session';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class ChargingSessionService {
  constructor(
    @InjectRepository(ChargingSession)
    private readonly chargingSessionRepository: Repository<ChargingSession>
  ) {}

  saveChargingSession(
    chargingSession: ChargingSession
  ): Promise<ChargingSession> {
    return this.chargingSessionRepository.save(chargingSession);
  }

  getChargingSessions(chargingStationId?: string, userId?: string) {
    const start = new Date().setHours(0, 0, 0);
    const end = new Date().setHours(23, 59, 59);
    return this.chargingSessionRepository.find({
      relations: {
        chargingStation: true,
      },
      where: {
        chargingStation: {
          id: chargingStationId,
        },
        user: {
          id: userId,
        },
        startTime: Between(new Date(start), new Date(end)),
      },
    });
  }

  getById(id: number) {
    return this.chargingSessionRepository.findOneBy({ id });
  }

  async activeSessionExistsForUserId(userId: string): Promise<boolean> {
    const now = new Date();
    return this.chargingSessionRepository.exists({
      where: {
        user: {
          id: userId,
        },
        startTime: LessThanOrEqual(new Date(now)),
        endTime: MoreThanOrEqual(new Date(now)),
      },
    });
  }
}
