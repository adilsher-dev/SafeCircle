package com.safecircle.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationResponse {

    private Long id;

    private Double latitude;

    private Double longitude;

    private Double accuracy;

    private Double speed;

    private Double heading;

    private Double altitude;

    private Integer batteryLevel;

    private String address;

    private LocalDateTime recordedAt;

    private Boolean mockLocation;

    private String networkType;

    private Long journeyId;

    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}