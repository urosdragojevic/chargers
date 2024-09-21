import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { ChargingSessionDto } from './charging-session/charging-session.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AddChargingStationDto {
  @ApiProperty()
  location: string;
}

export class EnterQueueDto {
  userId: number;
}

export class StartChargingSessionDto {
  @ApiProperty()
  userId: number; //TODO: Remove after auth
  @ApiProperty()
  chargingStationId: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/charging-stations')
  getChargingStations() {
    return this.appService.getChargingStations();
  }

  @Post('/charging-station')
  addChargingStation(@Body() id: AddChargingStationDto) {
    return this.appService.addChargingStation(id);
  }

  @Post('/charging-station/:id/enter-queue')
  enterQueue(@Param('id') id: string, @Body() dto: EnterQueueDto) {
    console.log(id);
    return this.appService.enterQueue(Number.parseInt(id), dto.userId);
  }

  @Get('/charging-sessions')
  getChargingSessions(@Query('chargingStationId') chargingStationId: number) {
    return this.appService.getChargingSessions(chargingStationId);
  }

  @Post('/charging-sessions')
  createChargingSession(@Body() chargingSession: ChargingSessionDto) {
    return this.appService.saveChargingSession(chargingSession);
  }

  @Post('/charging-sessions/start-session')
  startChargingSession(@Body() dto: StartChargingSessionDto) {
    return this.appService.startChargingSession(dto);
  }
}
