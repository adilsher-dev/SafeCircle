package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.RiskPredictionRequest;
import com.safecircle.backend.dto.RiskPredictionResponse;

public interface AIRiskPredictionService {

    ApiResponse<RiskPredictionResponse> predictRisk(
            RiskPredictionRequest request);


}