import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChargingSession } from '../charging-session/charging-session';
import { ApiProperty } from '@nestjs/swagger';
import { ChargingStationStatus } from './charging-station-status.enum';

@Entity()
export class ChargingStation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  location: string;

  @OneToMany(() => ChargingSession, (session) => session.chargingStation, {
    eager: true,
  })
  chargingSessions: ChargingSession[];

  @Column()
  status: ChargingStationStatus;
}
