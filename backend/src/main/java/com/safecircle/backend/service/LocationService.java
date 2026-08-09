
package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.LocationRequest;
import com.safecircle.backend.dto.LocationResponse;

import java.util.List;

public interface LocationService {

    ApiResponse<LocationResponse> saveLocation(LocationRequest request);

    ApiResponse<LocationResponse> getLatestLocation();

    ApiResponse<List<LocationResponse>> getJourneyLocations(Long journeyId);

    ApiResponse<String> deleteLocation(Long id);

}