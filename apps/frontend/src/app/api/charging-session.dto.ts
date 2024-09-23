export interface ChargingSessionDto {
  id: number;
  userId: string;
  chargingStationId: string;
  startTime: Date;
  endTime: Date;
  reserved: boolean;
}
