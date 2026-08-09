package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.ForgotPasswordRequest;
import com.safecircle.backend.dto.ResetPasswordRequest;
import com.safecircle.backend.dto.VerifyOtpRequest;

public interface OtpService {

    ApiResponse<String> sendOtp(String email);

    ApiResponse<String> verifyOtp(VerifyOtpRequest request);

    ApiResponse<String> forgotPassword(ForgotPasswordRequest request);

    ApiResponse<String> resetPassword(ResetPasswordRequest request);

}