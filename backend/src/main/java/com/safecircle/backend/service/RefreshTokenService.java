package com.safecircle.backend.service;

import com.safecircle.backend.dto.RefreshTokenRequest;
import com.safecircle.backend.dto.RefreshTokenResponse;

public interface RefreshTokenService {

    RefreshTokenResponse generateRefreshToken(String email);

    RefreshTokenResponse refreshAccessToken(RefreshTokenRequest request);

    void revokeRefreshToken(String email);

}