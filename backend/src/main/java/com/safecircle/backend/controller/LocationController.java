package com.safecircle.backend.controller;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.LocationRequest;
import com.safecircle.backend.dto.LocationResponse;
import com.safecircle.backend.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/location")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping("/update")
    public ResponseEntity<ApiResponse<LocationResponse>> updateLocation(
            @Valid @RequestBody LocationRequest request) {

        return ResponseEntity.ok(locationService.saveLocation(request));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<LocationResponse>> getLatestLocation() {

        return ResponseEntity.ok(locationService.getLatestLocation());
    }

    @GetMapping("/journey/{journeyId}")
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getJourneyLocations(
            @PathVariable Long journeyId) {

        return ResponseEntity.ok(locationService.getJourneyLocations(journeyId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteLocation(
            @PathVariable Long id) {

        return ResponseEntity.ok(locationService.deleteLocation(id));
    }

}