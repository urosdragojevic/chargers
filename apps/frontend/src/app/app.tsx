import ChargingStations from './charging-stations';
import { Queue } from './queue';
import { UserControls } from './user-controls';
import { useEffect, useRef, useState } from 'react';
import {
  endSession,
  enterQueue,
  getChargingSession,
  getChargingStations,
  getQueue,
} from './api/chargers.api';
import { ChargingStationDto } from './api/charging-station.dto';
import { ChargingSessionDto } from './api/charging-session.dto';

export function App() {
  const [queue, setQueue] = useState<number[]>([]);
  const [stations, setStations] = useState<ChargingStationDto[]>([]);
  const [isActiveSession, setActiveSession] = useState(false);
  const [session, setSession] = useState<ChargingSessionDto | undefined>();
  const intervalRef = useRef<number>(0);

  const refreshState = async () => {
    await getQueue().then((queue) => setQueue(queue));
    await getChargingStations().then((stations) => setStations(stations));
    await getChargingSession('166aec98-0a59-4b79-bba0-dcf9c1e019be').then(
      (sessions) => {
        const now = new Date();
        const active = sessions.filter(
          (s) => new Date(s.startTime) < now && new Date(s.endTime) > now
        );
        setActiveSession(active.length > 0);
        if (active.length > 0) {
          const cs = active.pop();
          if (cs) {
            setSession(cs);
          }
        }
      }
    );
  };

  const onEndSession = async () => {
    await endSession(session?.id);
    setActiveSession(false);
    setSession(undefined);
    await refreshState();
  };

  const onEnterQueue = async () => {
    await enterQueue();
    await refreshState();
  };

  useEffect(() => {
    refreshState();
    intervalRef.current = window.setInterval(refreshState, 5000);
    return () => window.clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <Queue queue={queue} />
      <ChargingStations stations={stations} />
      <UserControls
        isActiveSession={isActiveSession}
        onEnterQueue={onEnterQueue}
        onEndSession={onEndSession}
      />
    </div>
  );
}

export default App;
