package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.RiskRequest;
import com.safecircle.backend.dto.RiskResponse;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.LocationHistory;

public interface AIService {

    ApiResponse predictRisk(RiskRequest request);

    ApiResponse getRiskHistory(Long userId);

    ApiResponse getLatestRisk(Long userId);

    ApiResponse recalculateRisk(Long journeyId);

    ApiResponse<RiskResponse> predictLiveRisk(
            Journey journey,
            LocationHistory location
    );

}