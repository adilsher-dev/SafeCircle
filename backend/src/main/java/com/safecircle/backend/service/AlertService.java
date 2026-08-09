package com.safecircle.backend.service;

import com.safecircle.backend.dto.AlertRequest;
import com.safecircle.backend.dto.AlertResponse;
import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.RiskResponse;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.LocationHistory;

import java.util.List;

public interface AlertService {

    ApiResponse<AlertResponse> triggerAlert(AlertRequest request);

    ApiResponse<List<AlertResponse>> getMyAlerts();

    ApiResponse<AlertResponse> getAlertById(Long id);

    ApiResponse<AlertResponse> resolveAlert(Long id);

    ApiResponse<String> deleteAlert(Long id);

    ApiResponse<AlertResponse> triggerAutomaticSOS(
            Journey journey,
            LocationHistory location,
            RiskResponse riskResponse
    );

}