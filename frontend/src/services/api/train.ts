import { apiClient } from './client';
import { LiveTrainData, TrainSearchResult } from '../../types/train';
import { StationWeather } from '../../types/weather';
import { ApiResponse } from '../../types/api';

export async function searchTrains(query: string): Promise<TrainSearchResult[]> {
  if (!query.trim()) return [];
  const response = await apiClient.get<ApiResponse<TrainSearchResult[]>>('/search', {
    params: { q: query },
  });
  return response.data.data;
}

export async function getTrainStatus(trainNumber: string): Promise<LiveTrainData> {
  const response = await apiClient.get<ApiResponse<LiveTrainData>>(`/train/${trainNumber}`);
  return response.data.data;
}

export async function getWeather(lat: number, lng: number, code: string, name: string): Promise<StationWeather> {
  const response = await apiClient.get<ApiResponse<StationWeather>>('/weather', {
    params: { lat, lng, code, name },
  });
  return response.data.data;
}
