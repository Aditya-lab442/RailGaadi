import { useQuery } from '@tanstack/react-query';
import { getWeather } from '../services/api/train';
import { Station } from '../types/train';
import { StationWeather } from '../types/weather';

export function useWeather(
  currentStation: Station | null,
  nextStation: Station | null,
  destination: Station | null
) {
  const fetchAll = async (): Promise<{
    current?: StationWeather;
    next?: StationWeather;
    destination?: StationWeather;
  }> => {
    const results: { current?: StationWeather; next?: StationWeather; destination?: StationWeather } = {};

    await Promise.allSettled([
      currentStation
        ? getWeather(currentStation.lat, currentStation.lng, currentStation.code, currentStation.name).then(
            (w) => (results.current = w)
          )
        : Promise.resolve(),
      nextStation
        ? getWeather(nextStation.lat, nextStation.lng, nextStation.code, nextStation.name).then(
            (w) => (results.next = w)
          )
        : Promise.resolve(),
      destination
        ? getWeather(destination.lat, destination.lng, destination.code, destination.name).then(
            (w) => (results.destination = w)
          )
        : Promise.resolve(),
    ]);

    return results;
  };

  const key = [
    currentStation?.code,
    nextStation?.code,
    destination?.code,
  ].join('-');

  return useQuery({
    queryKey: ['weather', key],
    queryFn: fetchAll,
    enabled: Boolean(currentStation || nextStation || destination),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}
