package com.safecircle.backend.controller;

import com.safecircle.backend.dto.*;
import com.safecircle.backend.service.AuthService;
import com.safecircle.backend.service.OtpService;
import com.safecircle.backend.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final OtpService otpService;

    // ==========================
    // Register
    // ==========================
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));
    }

    // ==========================
    // Login
    // ==========================
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    // ==========================
    // Refresh Token
    // ==========================
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {

        return ResponseEntity.ok(
                refreshTokenService.refreshAccessToken(request));
    }

    // ==========================
    // Send OTP
    // ==========================
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<String>> sendOtp(
            @RequestParam String email) {

        return ResponseEntity.ok(
                otpService.sendOtp(email));
    }

    // ==========================
    // Verify OTP
    // ==========================
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        return ResponseEntity.ok(
                otpService.verifyOtp(request));
    }

    // ==========================
    // Forgot Password
    // ==========================
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        return ResponseEntity.ok(
                otpService.forgotPassword(request));
    }

    // ==========================
    // Reset Password
    // ==========================
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                otpService.resetPassword(request));
    }

}