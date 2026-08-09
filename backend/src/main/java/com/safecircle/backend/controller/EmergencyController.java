package com.safecircle.backend.controller;

import com.safecircle.backend.dto.AlertRequest;
import com.safecircle.backend.dto.AlertResponse;
import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.service.EmergencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping("/sos")
    public ResponseEntity<ApiResponse<AlertResponse>> triggerSOS(
            @Valid @RequestBody AlertRequest request) {

        return ResponseEntity.ok(emergencyService.triggerSOS(request));
    }

    @PutMapping("/cancel/{alertId}")
    public ResponseEntity<ApiResponse<AlertResponse>> cancelSOS(
            @PathVariable Long alertId) {

        return ResponseEntity.ok(emergencyService.cancelSOS(alertId));
    }

    @GetMapping("/my-alerts")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getMyAlerts() {

        return ResponseEntity.ok(emergencyService.getMyAlerts());
    }

    @GetMapping("/{alertId}")
    public ResponseEntity<ApiResponse<AlertResponse>> getAlertById(
            @PathVariable Long alertId) {

        return ResponseEntity.ok(emergencyService.getAlertById(alertId));
    }
}