package com.safecircle.backend.controller;

import com.safecircle.backend.dto.*;
import com.safecircle.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/weekly")
    public WeeklySafetyReportResponse getWeeklyReport() {
        return analyticsService.getWeeklyReport();
    }

    @GetMapping("/monthly")
    public MonthlySafetyReportResponse getMonthlyReport() {
        return analyticsService.getMonthlyReport();
    }

    @GetMapping("/journey-trend")
    public List<JourneyTrendResponse> getJourneyTrend() {
        return analyticsService.getJourneyTrend();
    }

    @GetMapping("/risk-trend")
    public List<RiskTrendResponse> getRiskTrend() {
        return analyticsService.getRiskTrend();
    }

}