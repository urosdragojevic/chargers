import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { ChargingSessionDto } from './charging-session/charging-session.dto';
import { ApiBasicAuth, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { AuthenticatedUser, User } from './auth/user.decorator';

export class AddChargingStationDto {
  @ApiProperty()
  location: string;
}

export class StartChargingSessionDto {
  @ApiProperty()
  chargingStationId: string;
}

export class ReserveSessionDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  chargingStationId: string;
  @ApiProperty()
  startTime: Date;
  @ApiProperty()
  endTime: Date;
}

@ApiBasicAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiQuery({ name: 'location', required: false, type: String })
  @Get('/charging-stations')
  getChargingStations(@Query('location') location?: string) {
    return this.appService.getChargingStations(location);
  }

  @Post('/charging-stations')
  addChargingStation(
    @Body() id: AddChargingStationDto,
    @User() user: AuthenticatedUser
  ) {
    console.log(user);
    return this.appService.addChargingStation(id);
  }

  @Get('/queue')
  getQueue() {
    return this.appService.getQueue();
  }

  @Post('/charging-stations/enter-queue')
  enterQueue(@User() user: AuthenticatedUser) {
    return this.appService.enterQueue(user.id);
  }

  @ApiQuery({ name: 'chargingStationId', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @Get('/charging-sessions')
  getChargingSessions(@Query('chargingStationId') chargingStationId?: string) {
    return this.appService.getChargingSessions(chargingStationId);
  }

  @Post('/charging-sessions')
  createChargingSession(@Body() chargingSession: ChargingSessionDto) {
    return this.appService.saveChargingSession(chargingSession);
  }

  @Post('/charging-sessions/start-session')
  startChargingSession(
    @Body() dto: StartChargingSessionDto,
    @User() user: AuthenticatedUser
  ) {
    return this.appService.startChargingSession(user.id, dto);
  }

  @Post('/charging-sessions/:id/end-session')
  endChargingSession(@Param('id') id: number, @User() user: AuthenticatedUser) {
    return this.appService.endChargingSession(id, user.id);
  }

  @Post('charging-sessions/reserve')
  reserveChargingSession(@Body() dto: ReserveSessionDto) {
    return this.appService.reserveSession(dto);
  }
}
