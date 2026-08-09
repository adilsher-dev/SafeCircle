package com.safecircle.backend.service;

import com.safecircle.backend.dto.AddressResponse;
import com.safecircle.backend.dto.RouteResponse;

public interface OpenStreetMapsService {

    AddressResponse reverseGeocode(
            Double latitude,
            Double longitude
    );

    RouteResponse getRoute(
            Double startLatitude,
            Double startLongitude,
            Double endLatitude,
            Double endLongitude
    );

}