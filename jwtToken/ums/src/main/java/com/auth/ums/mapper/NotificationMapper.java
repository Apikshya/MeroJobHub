package com.auth.ums.mapper;

import com.auth.ums.models.MessageNotification;
import com.auth.ums.responsemodels.MessageNotification.NotificationDTO;


import java.util.List;
import java.util.stream.Collectors;

public class NotificationMapper {

    // Entity → DTO
    public static NotificationDTO toDto(MessageNotification notification) {
        if (notification == null) {
            return null;
        }

        NotificationDTO dto = new NotificationDTO();

        dto.setId(notification.getId());
        dto.setUsername(notification.getUsername());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setAction(notification.getAction());
        dto.setStatus(notification.getStatus());
        dto.setReferenceId(notification.getReferenceId());
        dto.setCreatedDate(notification.getCreatedDate());
        dto.setReadDate(notification.getReadDate());

        return dto;
    }

    // List<Entity> → List<DTO>
    public static List<NotificationDTO> toDtoList(List<MessageNotification> notifications) {
        if (notifications == null) {
            return List.of();
        }

        return notifications.stream()
                .map(NotificationMapper::toDto)
                .collect(Collectors.toList());
    }
}
