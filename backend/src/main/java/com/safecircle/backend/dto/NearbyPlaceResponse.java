package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearbyPlaceResponse {

    private String name;

    private String address;

    private Double latitude;

    private Double longitude;

    private Double rating;

}