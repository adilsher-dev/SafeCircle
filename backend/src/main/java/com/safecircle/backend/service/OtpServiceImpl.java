package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.ForgotPasswordRequest;
import com.safecircle.backend.dto.ResetPasswordRequest;
import com.safecircle.backend.dto.VerifyOtpRequest;
import com.safecircle.backend.entity.OtpVerification;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.repository.OtpVerificationRepository;
import com.safecircle.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class OtpServiceImpl implements OtpService {

    private final UserRepository userRepository;
    private final OtpVerificationRepository otpRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Generate 6-digit OTP
     */
    private String generateOtp() {

        return String.valueOf(
                ThreadLocalRandom.current().nextInt(100000, 1000000)
        );
    }

    /**
     * Create and save OTP
     */
    private OtpVerification createOtp(String email) {

        otpRepository.deleteByEmail(email);

        String otp = generateOtp();

        OtpVerification verification = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .verified(false)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();

        return otpRepository.save(verification);
    }

    /**
     * Send OTP
     */
    @Override
    public ApiResponse<String> sendOtp(String email) {

        if (!userRepository.existsByEmail(email)) {
            throw new ResourceNotFoundException("User not found.");
        }

        OtpVerification otp = createOtp(email);

        // For development only.
        // Later replace this with Email/Twilio.
        return ApiResponse.<String>builder()
                .success(true)
                .message("OTP generated successfully.")
                .data("Your OTP is : " + otp.getOtp())
                .build();
    }

    /**
     * Verify OTP
     */
    @Override
    public ApiResponse<String> verifyOtp(VerifyOtpRequest request) {

        OtpVerification otp = otpRepository
                .findTopByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("OTP not found."));

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired.");
        }

        if (!otp.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP.");
        }

        otp.setVerified(true);

        otpRepository.save(otp);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        user.setIsVerified(true);

        userRepository.save(user);

        return ApiResponse.<String>builder()
                .success(true)
                .message("OTP verified successfully.")
                .data("Account verified.")
                .build();
    }

    /**
     * Forgot Password
     */
    @Override
    public ApiResponse<String> forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        OtpVerification otp = createOtp(user.getEmail());

        return ApiResponse.<String>builder()
                .success(true)
                .message("Password reset OTP generated successfully.")
                .data("Your OTP is : " + otp.getOtp())
                .build();
    }

    /**
     * Reset Password
     */
    @Override
    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {

        OtpVerification otp = otpRepository
                .findTopByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("OTP not found."));

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired.");
        }

        if (!otp.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);

        otpRepository.deleteByEmail(request.getEmail());

        return ApiResponse.<String>builder()
                .success(true)
                .message("Password reset successfully.")
                .data("Password updated successfully.")
                .build();
    }
}