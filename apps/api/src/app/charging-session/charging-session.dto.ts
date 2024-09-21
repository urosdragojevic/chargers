import { ApiProperty } from '@nestjs/swagger';

export class ChargingSessionDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  chargingStationId: string;
  @ApiProperty()
  startTime: Date;
  @ApiProperty()
  endTime: Date;
  @ApiProperty()
  reserved: boolean;
}
