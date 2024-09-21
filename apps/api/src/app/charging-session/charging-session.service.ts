import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargingSession } from './charging-session';
import { Repository } from 'typeorm';

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

  getChargingSessions(chargingStationId?: number) {
    return this.chargingSessionRepository.find({
      relations: {
        chargingStation: true,
      },
      where: {
        chargingStation: {
          id: chargingStationId,
        },
      },
    });
  }

  // TODO: get charging stations for today only
}
