import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ChargingStationModule } from '../charging-station/charging-station.module';
import { ChargingSessionModule } from '../charging-session/charging-session.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ChargingStationModule, ChargingSessionModule, UsersModule],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
