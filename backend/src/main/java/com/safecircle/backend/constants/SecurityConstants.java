package com.safecircle.backend.constants;

public final class SecurityConstants {

    private SecurityConstants() {
    }

    public static final String AUTH_HEADER = "Authorization";

    public static final String TOKEN_PREFIX = "Bearer ";

    public static final String[] PUBLIC_URLS = {

            "/api/auth/**",

            "/swagger-ui/**",

            "/v3/api-docs/**",

            "/ws/**"
    };
}