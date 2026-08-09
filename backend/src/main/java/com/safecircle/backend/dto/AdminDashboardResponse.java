package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    private long totalUsers;

    private long activeUsers;

    private long inactiveUsers;

    private long totalJourneys;

    private long totalAlerts;

    private long totalRiskAssessments;

}