package com.auth.ums.controller;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.MessageNotification.NotificationResponse;
import com.auth.ums.services.MessageNotification.MessageNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notification")
public class NotificationController {

    @Autowired
    private MessageNotificationService notificationService;

    @GetMapping("/get-my-notifications")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotificationOfLoggedInUser() {
        return ResponseEntity.ok(
                notificationService.getNotificationOfLoggedInUser()
        );
    }

    @PutMapping("/mark-as-read/{id}")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id)
        );
    }

    @PutMapping("/mark-all-as-read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAllAsRead(
            @RequestParam String username) {

        return ResponseEntity.ok(
                notificationService.markAllAsRead(username)
        );
    }
}
