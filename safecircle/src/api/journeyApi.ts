import { apiClient } from './client';
import type { ApiResponse, JourneyRequest, JourneyResponse } from '@/types';

// Mirrors JourneyController (/api/journeys)
export const journeyApi = {
  startJourney: (payload: JourneyRequest) =>
    apiClient.post<ApiResponse<JourneyResponse>>('/journeys/start', payload).then((r) => r.data),

  getJourneyById: (id: number) =>
    apiClient.get<ApiResponse<JourneyResponse>>(`/journeys/${id}`).then((r) => r.data),

  getMyJourneys: () =>
    apiClient.get<ApiResponse<JourneyResponse[]>>('/journeys/my').then((r) => r.data),

  endJourney: (id: number) =>
    apiClient.put<ApiResponse<JourneyResponse>>(`/journeys/end/${id}`).then((r) => r.data),

  deleteJourney: (id: number) =>
    apiClient.delete<ApiResponse<string>>(`/journeys/${id}`).then((r) => r.data),
};
