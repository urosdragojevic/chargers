import { Test, TestingModule } from '@nestjs/testing';
import { ChargingSessionService } from './charging-session.service';
import { ChargingSession } from './charging-session';
import { ChargingStationService } from '../charging-station/charging-station.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user';
import { ChargingStation } from '../charging-station/charging-station';

describe('ChargingSessionService', () => {
  let service: ChargingSessionService;
  const mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargingSessionService,
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

    service = module.get<ChargingSessionService>(ChargingSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to reserve before', () => {
    const existing = new ChargingSession();
    existing.startTime = new Date(Date.parse('2024-09-21T13:07:26.333Z'));
    existing.endTime = new Date(Date.parse('2024-09-21T13:17:26.333Z'));

    const session = new ChargingSession();
    session.startTime = new Date(Date.parse('2024-09-21T13:01:26.333Z'));
    session.endTime = new Date(Date.parse('2024-09-21T13:06:26.333Z'));

    expect(existing.isActive(session)).toBeTruthy();
  });

  it('should be able to reserve after', () => {
    const existing = new ChargingSession();
    existing.startTime = new Date(Date.parse('2024-09-21T13:07:26.333Z'));
    existing.endTime = new Date(Date.parse('2024-09-21T13:17:26.333Z'));

    const session = new ChargingSession();
    session.startTime = new Date(Date.parse('2024-09-21T13:18:26.333Z'));
    session.endTime = new Date(Date.parse('2024-09-21T13:20:26.333Z'));

    expect(existing.isActive(session)).toBeTruthy();
  });

  it('should not be able to reserve before', () => {
    const existing = new ChargingSession();
    existing.startTime = new Date(Date.parse('2024-09-21T13:07:26.333Z'));
    existing.endTime = new Date(Date.parse('2024-09-21T13:17:26.333Z'));

    const session = new ChargingSession();
    session.startTime = new Date(Date.parse('2024-09-21T13:05:26.333Z'));
    session.endTime = new Date(Date.parse('2024-09-21T13:15:26.333Z'));

    expect(existing.isActive(session)).toBeFalsy();
  });

  it('should not be able to reserve before 2', () => {
    const existing = new ChargingSession();
    existing.startTime = new Date(Date.parse('2024-09-21T13:07:26.333Z'));
    existing.endTime = new Date(Date.parse('2024-09-21T13:17:26.333Z'));

    const session = new ChargingSession();
    session.startTime = new Date(Date.parse('2024-09-21T13:05:26.333Z'));
    session.endTime = new Date(Date.parse('2024-09-21T13:20:26.333Z'));

    expect(existing.isActive(session)).toBeFalsy();
  });

  it('should not be able to reserve inside', () => {
    const existing = new ChargingSession();
    existing.startTime = new Date(Date.parse('2024-09-21T13:07:26.333Z'));
    existing.endTime = new Date(Date.parse('2024-09-21T13:17:26.333Z'));

    const session = new ChargingSession();
    session.startTime = new Date(Date.parse('2024-09-21T13:08:26.333Z'));
    session.endTime = new Date(Date.parse('2024-09-21T13:15:26.333Z'));

    expect(existing.isActive(session)).toBeFalsy();
  });

  it('should not be able to reserve inside after', () => {
    const existing = new ChargingSession();
    existing.startTime = new Date(Date.parse('2024-09-21T13:07:26.333Z'));
    existing.endTime = new Date(Date.parse('2024-09-21T13:17:26.333Z'));

    const session = new ChargingSession();
    session.startTime = new Date(Date.parse('2024-09-21T13:08:26.333Z'));
    session.endTime = new Date(Date.parse('2024-09-21T13:20:26.333Z'));

    expect(existing.isActive(session)).toBeFalsy();
  });
});
