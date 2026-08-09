package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskTrendResponse {

    private String month;

    private Long lowRisk;

    private Long mediumRisk;

    private Long highRisk;

    private Long criticalRisk;

}