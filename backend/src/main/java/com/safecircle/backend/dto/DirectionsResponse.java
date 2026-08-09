package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectionsResponse {

    private String origin;

    private String destination;

    private String distance;

    private String duration;

    private String polyline;

    private String status;
}