package com.safecircle.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationRequest {

    @NotNull(message = "Journey ID is required")
    private Long journeyId;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private Double longitude;

    private Double accuracy;

    private Double speed;

    private Double heading;

    private Double altitude;

    @Min(0)
    @Max(100)
    private Integer batteryLevel;

    private String address;

    private LocalDateTime recordedAt;

    private Boolean mockLocation;

    private String networkType;

}