package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.LoginRequest;
import com.safecircle.backend.dto.RegisterRequest;

public interface AuthService {

    ApiResponse register(RegisterRequest request);

    ApiResponse login(LoginRequest request);

}