package com.auth.ums.requestmodels.MessageNotification;

import com.auth.ums.enums.NotificationAction;
import lombok.Data;

import java.util.List;

@Data
public class PushByEmailRequest {
    private List<String> emails;
    private NotificationAction action;
    private String title;
    private String message;
    private String createdBy;
}
