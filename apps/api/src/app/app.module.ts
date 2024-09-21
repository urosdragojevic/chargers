import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ChargingStationService } from './charging-station/charging-station.service';
import { ChargingSessionService } from './charging-session/charging-session.service';
import { QueueService } from './queue/queue.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'rivian',
      password: 'rivian',
      database: 'chargers',
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ChargingStationService,
    ChargingSessionService,
    QueueService,
  ],
})
export class AppModule {}
