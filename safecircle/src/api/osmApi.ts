import { apiClient } from './client';
import type { AddressResponse, RouteResponse } from '@/types';

// Mirrors OpenStreetMapController (/api/openstreet)
// NOTE: unwrapped responses, returns DTOs directly
export const osmApi = {
  reverseGeocode: (latitude: number, longitude: number) =>
    apiClient
      .get<AddressResponse>('/openstreet/address', { params: { latitude, longitude } })
      .then((r) => r.data),

  getRoute: (startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number) =>
    apiClient
      .post<RouteResponse>('/openstreet/route', {
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
      })
      .then((r) => r.data),
};
