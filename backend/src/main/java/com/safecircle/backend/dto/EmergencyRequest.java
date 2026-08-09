package com.safecircle.backend.dto;

import com.safecircle.backend.enums.AlertType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private Long journeyId;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Alert type is required")
    private AlertType alertType;

    private String message;
}