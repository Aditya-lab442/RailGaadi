import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api/client';
import { ApiResponse } from '../types/api';

export interface ElevationPoint {
  lat: number;
  lng: number;
  elevation: number;
  distanceFromOriginKm: number;
}

export interface ElevationProfile {
  points: ElevationPoint[];
  highestPoint: ElevationPoint;
  lowestPoint: ElevationPoint;
}

export function useElevation(trainNumber: string) {
  return useQuery<ElevationProfile>({
    queryKey: ['elevation', trainNumber],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<ElevationProfile>>(`/elevation/${trainNumber}`);
      return res.data.data;
    },
    enabled: Boolean(trainNumber),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 1,
  });
}
