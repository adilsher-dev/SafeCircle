package com.safecircle.backend.controller;

import com.safecircle.backend.dto.AdminDashboardResponse;
import com.safecircle.backend.dto.AdminUserResponse;
import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.UserStatusRequest;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> dashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> users() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> user(
            @PathVariable Long id) {

        return ResponseEntity.ok(adminService.getUser(id));
    }

    @PutMapping("/user/status")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @Valid @RequestBody UserStatusRequest request) {

        return ResponseEntity.ok(
                adminService.updateUserStatus(request));
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.deleteUser(id));
    }
}