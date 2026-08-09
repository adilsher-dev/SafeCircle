package com.safecircle.backend.controller;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.JourneyRequest;
import com.safecircle.backend.dto.JourneyResponse;
import com.safecircle.backend.service.JourneyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journeys")
@RequiredArgsConstructor
public class JourneyController {

    private final JourneyService journeyService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<JourneyResponse>> startJourney(
            @Valid @RequestBody JourneyRequest request) {

        return ResponseEntity.ok(journeyService.startJourney(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JourneyResponse>> getJourneyById(
            @PathVariable Long id) {

        return ResponseEntity.ok(journeyService.getJourneyById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<JourneyResponse>>> getMyJourneys() {

        return ResponseEntity.ok(journeyService.getMyJourneys());
    }

    @PutMapping("/end/{id}")
    public ResponseEntity<ApiResponse<JourneyResponse>> endJourney(
            @PathVariable Long id) {

        return ResponseEntity.ok(journeyService.endJourney(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteJourney(
            @PathVariable Long id) {

        return ResponseEntity.ok(journeyService.deleteJourney(id));
    }
}