package com.safecircle.backend.dto;

import com.safecircle.backend.enums.JourneyStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourneyStatusMessage {

    private Long journeyId;

    private Long userId;

    private JourneyStatus status;

    private String source;

    private String destination;

    private LocalDateTime updatedAt;
}