package com.safecircle.backend.controller;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.JourneyProgressResponse;
import com.safecircle.backend.service.LiveTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/live")
@RequiredArgsConstructor
public class LiveTrackingController {

    private final LiveTrackingService liveTrackingService;

    @GetMapping("/{journeyId}")
    public ApiResponse<JourneyProgressResponse> track(

            @PathVariable Long journeyId) {

        return liveTrackingService.getJourneyProgress(journeyId);

    }

}