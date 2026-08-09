package com.safecircle.backend.dto;

import com.safecircle.backend.enums.RiskLevel;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskResponse {

    private Long riskAssessmentId;

    private Integer riskScore;

    private RiskLevel riskLevel;

    private String predictionReason;

    private String recommendation;

    private Double latitude;

    private Double longitude;
}