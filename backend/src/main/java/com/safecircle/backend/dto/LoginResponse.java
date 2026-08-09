package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;

    private String refreshToken;

    private Long userId;

    private String fullName;

    private String email;

}