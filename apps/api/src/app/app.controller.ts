import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { ChargingSessionDto } from './charging-session/charging-session.dto';
import { ApiBasicAuth, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { AuthenticatedUser, User } from './auth/user.decorator';

export class AddChargingStationDto {
  @ApiProperty()
  location: string;
}

export class EnterQueueDto {
  @ApiProperty()
  userId: string;
}

export class StartChargingSessionDto {
  @ApiProperty()
  userId: string; //TODO: Remove after auth
  @ApiProperty()
  chargingStationId: string;
}

export class EndSessionDto {
  @ApiProperty()
  userId: string; //TODO: Remove after auth
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

  @Post('/charging-stations/enter-queue')
  enterQueue(@Body() dto: EnterQueueDto) {
    return this.appService.enterQueue(dto.userId);
  }

  @ApiQuery({ name: 'chargingStationId', required: false, type: String })
  @Get('/charging-sessions')
  getChargingSessions(@Query('chargingStationId') chargingStationId?: string) {
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

  @Post('/charging-sessions/:id/end-session')
  endChargingSession(@Param('id') id: number, @Body() dto: EndSessionDto) {
    return this.appService.endChargingSession(id, dto);
  }

  @Post('charging-sessions/reserve')
  reserveChargingSession(@Body() dto: ReserveSessionDto) {
    return this.appService.reserveSession(dto);
  }
}
