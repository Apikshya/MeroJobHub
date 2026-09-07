package com.auth.ums.services.MessageNotification;

import com.auth.ums.enums.NotificationAction;
import com.auth.ums.requestmodels.MessageNotification.NotificationRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.MessageNotification.NotificationResponse;
import com.auth.ums.responsemodels.job.JobResponse;

import java.util.List;

public interface MessageNotificationService {
    void push(NotificationRequest request);
    void pushBulk(List<NotificationRequest> requests);
    void pushByEmails(List<String> emails, NotificationAction action, String title, String message, String createdBy);
    List<NotificationResponse> getByUsername(String username);
    //void markAsRead(Long id);
    //void markAllAsRead(String username);

    ApiResponse<NotificationResponse> getNotificationOfLoggedInUser();
    ApiResponse<NotificationResponse> markAsRead(Long id);
    ApiResponse<NotificationResponse> markAllAsRead(String username);
}