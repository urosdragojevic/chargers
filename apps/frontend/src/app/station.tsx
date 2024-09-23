import { ChargingStationDto } from './api/charging-station.dto';

export const ChargingStation = ({
  id,
  location,
  status,
}: ChargingStationDto) => {
  return (
    <div>
      <p>ID: {id}</p>
      <p>Location: {location}</p>
      <p>Status: {status}</p>
    </div>
  );
};
