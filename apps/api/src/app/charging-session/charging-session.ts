import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user';
import { ChargingStation } from '../charging-station/charging-station';

@Entity()
export class ChargingSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => ChargingStation)
  @JoinColumn()
  chargingStation: ChargingStation;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column()
  reserved: boolean;
}
