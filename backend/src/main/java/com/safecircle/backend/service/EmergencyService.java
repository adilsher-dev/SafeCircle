package com.safecircle.backend.service;

import com.safecircle.backend.dto.AlertRequest;
import com.safecircle.backend.dto.AlertResponse;
import com.safecircle.backend.dto.ApiResponse;

import java.util.List;

public interface EmergencyService {

    ApiResponse<AlertResponse> triggerSOS(AlertRequest request);

    ApiResponse<AlertResponse> cancelSOS(Long alertId);

    ApiResponse<List<AlertResponse>> getMyAlerts();

    ApiResponse<AlertResponse> getAlertById(Long alertId);

}