import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargingStation } from './charging-station';
import { Repository } from 'typeorm';

@Injectable()
export class ChargingStationService {
  constructor(
    @InjectRepository(ChargingStation)
    private readonly chargingStationRepository: Repository<ChargingStation>
  ) {}

  getChargingStations() {
    return this.chargingStationRepository.find();
  }

  getById(id: number) {
    return this.chargingStationRepository.findOneBy({ id });
  }

  createChargingStation(chargingStation: ChargingStation) {
    return this.chargingStationRepository.save(chargingStation);
  }
}
