package com.safecircle.backend.dto;

import com.safecircle.backend.enums.RiskLevel;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskPredictionResponse {

    private Long riskAssessmentId;

    private Long journeyId;

    private Integer riskScore;

    private RiskLevel riskLevel;

    private String predictionReason;

    private String recommendation;

    private LocalDateTime createdAt;


}