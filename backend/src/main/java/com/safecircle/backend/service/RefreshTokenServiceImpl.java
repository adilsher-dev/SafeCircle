package com.safecircle.backend.service;

import com.safecircle.backend.dto.RefreshTokenRequest;
import com.safecircle.backend.dto.RefreshTokenResponse;
import com.safecircle.backend.entity.RefreshToken;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.repository.RefreshTokenRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public RefreshTokenResponse generateRefreshToken(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        refreshTokenRepository.findByUser(user)
                .ifPresent(refreshTokenRepository::delete);

        String token = jwtService.generateRefreshToken(email);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        return RefreshTokenResponse.builder()
                .accessToken(null)
                .refreshToken(token)
                .tokenType("Bearer")
                .build();
    }

    @Override
    public RefreshTokenResponse refreshAccessToken(RefreshTokenRequest request) {

        RefreshToken storedToken = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Refresh token not found"));

        if (storedToken.getRevoked()) {
            throw new RuntimeException("Refresh token has been revoked.");
        }

        if (storedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token has expired.");
        }

        User user = storedToken.getUser();

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("USER")
                .build();

        String accessToken = jwtService.generateToken(userDetails);

        return RefreshTokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(storedToken.getToken())
                .tokenType("Bearer")
                .build();
    }

    @Override
    public void revokeRefreshToken(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        refreshTokenRepository.deleteByUser(user);
    }
}