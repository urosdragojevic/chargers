import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingSession } from './charging-session';
import { ChargingSessionService } from './charging-session.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChargingSession])],
  providers: [ChargingSessionService],
  exports: [ChargingSessionService],
})
export class ChargingSessionModule {}
