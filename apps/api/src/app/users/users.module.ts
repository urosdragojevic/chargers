import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ChargingStation } from '../charging-station/charging-station';
import { ChargingSession } from '../charging-session/charging-session';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChargingStation, ChargingSession])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
