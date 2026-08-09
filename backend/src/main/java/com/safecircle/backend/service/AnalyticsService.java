package com.safecircle.backend.service;

import com.safecircle.backend.dto.*;

import java.util.List;

public interface AnalyticsService {

    WeeklySafetyReportResponse getWeeklyReport();

    MonthlySafetyReportResponse getMonthlyReport();

    List<JourneyTrendResponse> getJourneyTrend();

    List<RiskTrendResponse> getRiskTrend();

}