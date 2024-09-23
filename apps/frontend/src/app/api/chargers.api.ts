import apiClient from './api-client';
import { ChargingStationDto } from './charging-station.dto';
import { ChargingSessionDto } from './charging-session.dto';

export function getChargingStations(): Promise<ChargingStationDto[]> {
  return apiClient
    .get<ChargingStationDto[]>('/api/charging-stations')
    .then((response) => response.data);
}

export function getQueue(): Promise<number[]> {
  return apiClient
    .get<number[]>('/api/queue')
    .then((response) => response.data);
}

export function enterQueue(): Promise<void> {
  return apiClient
    .post<void>('/api/queue/enter')
    .then((response) => response.data);
}

export function getChargingSession(
  userId?: string
): Promise<ChargingSessionDto[]> {
  return apiClient
    .get<ChargingSessionDto[]>(`/api/charging-sessions?userId=${userId}`)
    .then((response) => response.data);
}

export function endSession(sessionId?: number) {
  return apiClient
    .post<void>(`/api/charging-sessions/${sessionId}/end-session`)
    .then((response) => response.data);
}
