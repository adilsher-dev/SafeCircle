package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.JourneyRequest;
import com.safecircle.backend.dto.JourneyResponse;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.LocationHistory;

import java.util.List;

public interface JourneyService {

    ApiResponse<JourneyResponse> startJourney(JourneyRequest request);

    ApiResponse<JourneyResponse> getJourneyById(Long id);

    ApiResponse<List<JourneyResponse>> getMyJourneys();

    ApiResponse<JourneyResponse> endJourney(Long id);

    ApiResponse<String> deleteJourney(Long id);

    void updateJourneyStatistics(
            Journey journey,
            LocationHistory latestLocation
    );

    void completeJourneyAutomatically(Journey journey);


}