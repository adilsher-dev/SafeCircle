package com.safecircle.backend.dto;

import lombok.Data;

@Data
public class GeocodeResult {

    private String formatted_address;

    private Geometry geometry;

}