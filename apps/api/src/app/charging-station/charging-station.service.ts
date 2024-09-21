import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargingStation } from './charging-station';
import { Repository } from 'typeorm';
import { ChargingStationStatus } from './charging-station-status.enum';

@Injectable()
export class ChargingStationService {
  constructor(
    @InjectRepository(ChargingStation)
    private readonly chargingStationRepository: Repository<ChargingStation>
  ) {}

  getChargingStations(location?: string) {
    return this.chargingStationRepository.find({
      where: {
        location,
      },
    });
  }

  getAvailableChargingStations() {
    return this.chargingStationRepository.find({
      where: {
        status: ChargingStationStatus.FREE,
      },
    });
  }

  getById(id: string) {
    return this.chargingStationRepository.findOneBy({ id });
  }

  createChargingStation(chargingStation: ChargingStation) {
    return this.chargingStationRepository.save(chargingStation);
  }
}
