package com.safecircle.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveLocationMessage {

    private Long journeyId;

    private Long userId;

    private Double latitude;

    private Double longitude;

    private Double speed;

    private Double accuracy;

    private String address;

    private LocalDateTime timestamp;
}