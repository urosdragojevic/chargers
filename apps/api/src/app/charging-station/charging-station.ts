import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChargingSession } from '../charging-session/charging-session';
import { ChargingStationStatus } from './charging-station-status.enum';

@Entity()
export class ChargingStation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location: string;

  @OneToMany(() => ChargingSession, (session) => session.chargingStation)
  chargingSessions: Promise<ChargingSession[]>;

  @Column({
    type: 'enum',
    enum: ChargingStationStatus,
    default: ChargingStationStatus.FREE,
  })
  status: ChargingStationStatus;
}
