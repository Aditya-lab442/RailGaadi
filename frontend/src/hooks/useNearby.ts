import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api/client';
import { ApiResponse } from '../types/api';

export interface NearbyFeature {
  type: 'River' | 'Ghat' | 'Bridge' | 'Tunnel' | 'Monument';
  name: string;
  distanceKm: number;
  description: string;
}

export function useNearby(trainNumber: string) {
  return useQuery<NearbyFeature[]>({
    queryKey: ['nearby', trainNumber],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<NearbyFeature[]>>(`/nearby/${trainNumber}`);
      return res.data.data;
    },
    enabled: Boolean(trainNumber),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 1,
  });
}
