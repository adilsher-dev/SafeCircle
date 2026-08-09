//package com.safecircle.backend.controller;
//
//import com.safecircle.backend.dto.ApiResponse;
//import com.safecircle.backend.dto.RiskRequest;
//import com.safecircle.backend.service.AIService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/ai")
//@RequiredArgsConstructor
//public class AIController {
//
//    private final AIService aiService;
//
//    @PostMapping("/predict")
//    public ResponseEntity<ApiResponse> predictRisk(
//            @Valid @RequestBody RiskRequest request) {
//
//        return ResponseEntity.ok(aiService.predictRisk(request));
//    }
//
//    @GetMapping("/history/{userId}")
//    public ResponseEntity<ApiResponse> getRiskHistory(
//            @PathVariable Long userId) {
//
//        return ResponseEntity.ok(aiService.getRiskHistory(userId));
//    }
//
//    @GetMapping("/latest/{userId}")
//    public ResponseEntity<ApiResponse> getLatestRisk(
//            @PathVariable Long userId) {
//
//        return ResponseEntity.ok(aiService.getLatestRisk(userId));
//    }
//
//    @PutMapping("/recalculate/{journeyId}")
//    public ResponseEntity<ApiResponse> recalculateRisk(
//            @PathVariable Long journeyId) {
//
//        return ResponseEntity.ok(aiService.recalculateRisk(journeyId));
//    }
//}