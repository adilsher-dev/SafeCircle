package com.safecircle.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationStatisticsResponse {

    private Long totalNotifications;

    private Long readNotifications;

    private Long unreadNotifications;

}