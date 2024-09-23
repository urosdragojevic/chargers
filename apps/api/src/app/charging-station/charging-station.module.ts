import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingStation } from './charging-station';
import { ChargingStationService } from './charging-station.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChargingStation])],
  providers: [ChargingStationService],
  exports: [ChargingStationService],
})
export class ChargingStationModule {}
