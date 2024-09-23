import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { ChargingStationService } from '../charging-station/charging-station.service';
import { ChargingSessionService } from '../charging-session/charging-session.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user';
import { ChargingStation } from '../charging-station/charging-station';
import { ChargingSession } from '../charging-session/charging-session';

describe('QueueService', () => {
  let service: QueueService;
  const mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        ChargingStationService,
        ChargingSessionService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ChargingStation),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ChargingSession),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return next in queue by priority', () => {
    service.addToQueue('a');
    service.addToQueue('b');
    service.addToQueue('c');
    service.addToQueue('d');
    expect(service.getNextInQueue()).toEqual({
      userId: 'a',
      priority: 1,
    });
    expect(service.getNextInQueue()).toEqual({
      userId: 'b',
      priority: 2,
    });
    expect(service.getNextInQueue()).toEqual({
      userId: 'c',
      priority: 3,
    });
    expect(service.getNextInQueue()).toEqual({
      userId: 'd',
      priority: 4,
    });
  });
});
