package com.safecircle.backend.controller;

import com.safecircle.backend.dto.DashboardResponse;
import com.safecircle.backend.dto.JourneyStatisticsResponse;
import com.safecircle.backend.dto.NotificationStatisticsResponse;
import com.safecircle.backend.dto.SafetyStatisticsResponse;
import com.safecircle.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                dashboardService.getDashboard());
    }

    @GetMapping("/journey")
    public ResponseEntity<JourneyStatisticsResponse> getJourneyStatistics() {

        return ResponseEntity.ok(
                dashboardService.getJourneyStatistics());
    }

    @GetMapping("/safety")
    public ResponseEntity<SafetyStatisticsResponse> getSafetyStatistics() {

        return ResponseEntity.ok(
                dashboardService.getSafetyStatistics());
    }

    @GetMapping("/notifications")
    public ResponseEntity<NotificationStatisticsResponse> getNotificationStatistics() {

        return ResponseEntity.ok(
                dashboardService.getNotificationStatistics());
    }

}