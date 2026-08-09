import { apiClient } from './client';
import type { ApiResponse, JourneyProgressResponse, LocationRequest, LocationResponse } from '@/types';

// Mirrors LiveTrackingController (/api/live)
export const liveTrackingApi = {
  getJourneyProgress: (journeyId: number) =>
    apiClient
      .get<ApiResponse<JourneyProgressResponse>>(`/live/${journeyId}`)
      .then((r) => r.data),
};

// Mirrors LocationController (/api/location)
export const locationApi = {
  updateLocation: (payload: LocationRequest) =>
    apiClient.post<ApiResponse<LocationResponse>>('/location/update', payload).then((r) => r.data),

  getLatestLocation: () =>
    apiClient.get<ApiResponse<LocationResponse>>('/location/latest').then((r) => r.data),

  getJourneyLocations: (journeyId: number) =>
    apiClient
      .get<ApiResponse<LocationResponse[]>>(`/location/journey/${journeyId}`)
      .then((r) => r.data),

  deleteLocation: (id: number) =>
    apiClient.delete<ApiResponse<string>>(`/location/${id}`).then((r) => r.data),
};
