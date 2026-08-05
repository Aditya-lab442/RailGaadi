import { useQuery } from '@tanstack/react-query';
import { getTrainStatus } from '../services/api/train';
import { REFRESH_INTERVAL_MS } from '../constants/config';

export function useTrain(trainNumber: string) {
  return useQuery({
    queryKey: ['liveTrain', trainNumber],
    queryFn: () => getTrainStatus(trainNumber),
    enabled: Boolean(trainNumber),
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: 10 * 1000,
  });
}
