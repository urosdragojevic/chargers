import { ChargingStationDto } from './api/charging-station.dto';
import { ChargingStation } from './station';

export function ChargingStations({
  stations,
}: {
  stations: ChargingStationDto[];
}) {
  return (
    <>
      <ol></ol>
      <ul>
        {stations.map((station: ChargingStationDto) => (
          <li key={station.id}>
            <ChargingStation {...station} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default ChargingStations;
