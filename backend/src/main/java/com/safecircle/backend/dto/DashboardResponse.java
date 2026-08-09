package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private String fullName;

    private Long totalJourneys;

    private Long activeJourneys;

    private Long completedJourneys;

    private Long cancelledJourneys;

    private Long totalTrustedContacts;

    private Long totalAlerts;

    private Long totalNotifications;

    private Long unreadNotifications;

    private Long lowRiskCount;

    private Long mediumRiskCount;

    private Long highRiskCount;

    private Long criticalRiskCount;

}