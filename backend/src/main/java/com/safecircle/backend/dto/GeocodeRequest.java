package com.safecircle.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeocodeRequest {

    @NotBlank(message = "Address is required")
    private String address;

}