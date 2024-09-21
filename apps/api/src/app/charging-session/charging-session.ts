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
  chargingStation: Promise<ChargingStation>;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  reserved: boolean;

  isUser(user: User) {
    return this.user.id === user.id;
  }

  isActive(other: ChargingSession) {
    return (
      (this.startTime > other.startTime && this.startTime > other.endTime) ||
      (this.endTime < other.startTime && this.endTime < other.endTime)
    );
  }
}
