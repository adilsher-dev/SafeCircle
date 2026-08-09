package com.safecircle.backend.service;

import com.safecircle.backend.dto.*;

public interface DashboardService {

    DashboardResponse getDashboard();

    JourneyStatisticsResponse getJourneyStatistics();

    SafetyStatisticsResponse getSafetyStatistics();

    NotificationStatisticsResponse getNotificationStatistics();

}