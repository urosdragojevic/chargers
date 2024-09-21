import { ApiProperty } from '@nestjs/swagger';

export class ChargingSessionDto {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  chargingStationId: number;
  @ApiProperty()
  startTime: Date;
  @ApiProperty()
  endTime: Date;
  @ApiProperty()
  reserved: boolean;
}
