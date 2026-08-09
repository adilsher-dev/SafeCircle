package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklySafetyReportResponse {

    private Long totalJourneys;

    private Long completedJourneys;

    private Long cancelledJourneys;

    private Long alertsTriggered;

    private Long highRiskEvents;

    private Double safetyScore;

}