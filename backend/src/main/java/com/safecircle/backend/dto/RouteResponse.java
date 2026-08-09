package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteResponse {

    private Double distance;

    private Double duration;

    private String geometry;

    private String status;

}