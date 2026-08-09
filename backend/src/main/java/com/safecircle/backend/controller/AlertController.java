package com.safecircle.backend.controller;

import com.safecircle.backend.dto.AlertRequest;
import com.safecircle.backend.dto.AlertResponse;
import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping("/trigger")
    public ResponseEntity<ApiResponse<AlertResponse>> triggerAlert(
            @Valid @RequestBody AlertRequest request) {

        return ResponseEntity.ok(
                alertService.triggerAlert(request)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getMyAlerts() {

        return ResponseEntity.ok(
                alertService.getMyAlerts()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AlertResponse>> getAlert(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                alertService.getAlertById(id)
        );
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<AlertResponse>> resolveAlert(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                alertService.resolveAlert(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAlert(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                alertService.deleteAlert(id)
        );
    }

}