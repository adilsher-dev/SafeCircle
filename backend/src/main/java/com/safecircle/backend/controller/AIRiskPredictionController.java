package com.safecircle.backend.controller;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.RiskPredictionRequest;
import com.safecircle.backend.dto.RiskPredictionResponse;
import com.safecircle.backend.service.AIRiskPredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIRiskPredictionController {

    private final AIRiskPredictionService aiRiskPredictionService;

    @PostMapping("/predict")
    public ResponseEntity<ApiResponse<RiskPredictionResponse>> predictRisk(
            @Valid @RequestBody RiskPredictionRequest request) {

        return ResponseEntity.ok(
                aiRiskPredictionService.predictRisk(request)
        );
    }
}