import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { ChargingSessionDto } from './charging-session/charging-session.dto';
import { ApiBasicAuth, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { User } from './auth/user.decorator';
import { AuthenticatedUser } from './auth/authenticated-user';

export class AddChargingStationDto {
  @ApiProperty()
  location: string;
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
  addChargingStation(@Body() id: AddChargingStationDto) {
    return this.appService.addChargingStation(id);
  }

  @Get('/queue')
  getQueue() {
    return this.appService.getQueue();
  }

  @Post('/queue/enter')
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

  @Post('/charging-sessions/:id/end-session')
  endChargingSession(@Param('id') id: number, @User() user: AuthenticatedUser) {
    return this.appService.endChargingSession(id, user.id);
  }
}
