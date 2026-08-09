package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourneyStatisticsResponse {

    private Long totalJourneys;

    private Long activeJourneys;

    private Long completedJourneys;

    private Long cancelledJourneys;

    private Double totalDistance;

    private Double averageDistance;

}