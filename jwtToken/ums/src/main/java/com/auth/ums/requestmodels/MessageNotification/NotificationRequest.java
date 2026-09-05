package com.auth.ums.requestmodels.MessageNotification;

import com.auth.ums.enums.NotificationAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private String username;
    private String title;
    private String message;
    private NotificationAction action;
    private String referenceId;
    private String metadata;
    private String createdBy;
}
