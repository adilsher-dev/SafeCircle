package com.safecircle.backend.controller;

import com.safecircle.backend.dto.AddressResponse;
import com.safecircle.backend.dto.RouteRequest;
import com.safecircle.backend.dto.RouteResponse;
import com.safecircle.backend.service.OpenStreetMapsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/openstreet")
@RequiredArgsConstructor
public class OpenStreetMapController {

    private final OpenStreetMapsService openStreetMapService;

    /**
     * Reverse Geocoding
     * Get Address from Latitude & Longitude
     */
    @GetMapping("/address")
    public ResponseEntity<AddressResponse> reverseGeocode(

            @RequestParam Double latitude,

            @RequestParam Double longitude) {

        return ResponseEntity.ok(

                openStreetMapService.reverseGeocode(

                        latitude,

                        longitude
                )
        );
    }

    /**
     * Route Generation
     * Source -> Destination
     */
    @PostMapping("/route")
    public ResponseEntity<RouteResponse> getRoute(

            @RequestBody RouteRequest request) {

        return ResponseEntity.ok(

                openStreetMapService.getRoute(

                        request.getStartLatitude(),

                        request.getStartLongitude(),

                        request.getEndLatitude(),

                        request.getEndLongitude()
                )
        );
    }

}