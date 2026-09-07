package com.auth.ums.services.MessageNotification;

import com.auth.ums.configs.ÄpiMessageCodes;
import com.auth.ums.enums.NotificationAction;
import com.auth.ums.enums.ReadStatus;
import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.mapper.NotificationMapper;
import com.auth.ums.models.MessageNotification;
import com.auth.ums.repository.MessageNotificationRepository;
import com.auth.ums.requestmodels.MessageNotification.NotificationRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.MessageNotification.NotificationResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageNotificationServiceImpl implements MessageNotificationService {

    private static final Logger log = LoggerFactory.getLogger(MessageNotificationServiceImpl.class);
    private final MessageNotificationRepository repository;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void push(NotificationRequest request) {
        repository.save(toEntity(request));
    }

    @Override
    public void pushBulk(List<NotificationRequest> requests) {
        if (requests == null || requests.isEmpty()) return;
        List<MessageNotification> entities = requests.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
        repository.saveAll(entities);
    }

    @Override
    public void pushByEmails(List<String> emails, NotificationAction action, String title,
                             String message, String createdBy) {
        if (emails == null || emails.isEmpty()) return;

        LocalDateTime now = LocalDateTime.now();

        List<MessageNotification> entities = emails.stream()
                .filter(email -> email != null && !email.isBlank())
                .map(email -> {
                    MessageNotification n = new MessageNotification();
                    n.setUsername(email); // fallback if username != email in your system, resolve separately
                    n.setTitle(title);
                    n.setMessage(message);
                    n.setAction(action);
                    n.setStatus(ReadStatus.UNREAD);
                    n.setCreatedDate(now);
                    n.setCreatedBy(createdBy);
                    n.setIsActive(true);
                    n.setIsDeleted(false);
                    return n;
                })
                .collect(Collectors.toList());

        repository.saveAll(entities);
    }

    @Override
    public List<NotificationResponse> getByUsername(String username) {

        log.info("Request received to get notifications for username : {}", username);

        try {
            List<MessageNotification> notifications =
                    repository.findByUsernameAndIsDeletedFalseOrderByCreatedDateDesc(username);

            if (notifications.isEmpty()) {
                return List.of();
            }

            return notifications.stream()
                    .map(notification -> {
                        NotificationResponse response = new NotificationResponse();
                        response.setNotification(NotificationMapper.toDto(notification));
                        return response;
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {

            log.error("Error occurred while fetching notifications : {}", e.getMessage(), e);

            return List.of();
        }
    }


    @Override
    public ApiResponse<NotificationResponse> getNotificationOfLoggedInUser() {

        log.info("Request received to get notifications of logged-in user");

        NotificationResponse response = new NotificationResponse();

        try {
            String username = jwtUtil.getCurrentUsername();

            List<MessageNotification> notifications =
                    repository.findByUsernameAndIsDeletedFalseOrderByCreatedDateDesc(username);

            if (notifications.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            response.setNotifications(
                    NotificationMapper.toDtoList(notifications)
            );

            return ApiResponse.success(
                    response,
                    ÄpiMessageCodes.DATA_RETRIEVED_SUCCESSFULLY.toString()
            );

        } catch (Exception e) {

            log.error("Error occurred while fetching logged-in user notifications : {}",
                    e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }


    @Override
    public ApiResponse<NotificationResponse> markAsRead(Long id) {

        log.info("Request received to mark notification as read. Id : {}", id);

        NotificationResponse response = new NotificationResponse();

        try {
            Optional<MessageNotification> optional = repository.findById(id);

            if (optional.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            MessageNotification notification = optional.get();

            if (notification.getIsDeleted()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            notification.setStatus(ReadStatus.READ);
            notification.setReadDate(LocalDateTime.now());
            notification.setUpdatedDate(LocalDateTime.now());
            notification.setUpdatedBy(jwtUtil.getCurrentUsername());

            repository.save(notification);

            response.setNotification(NotificationMapper.toDto(notification));

            return ApiResponse.success(
                    response,
                    ÄpiMessageCodes.UPDATED_SUCCESSFULLY.toString()
            );

        } catch (Exception e) {

            log.error("Error occurred while marking notification as read : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<NotificationResponse> markAllAsRead(String username) {

        log.info("Request received to mark all notifications as read for user : {}", username);

        NotificationResponse response = new NotificationResponse();

        try {
            List<MessageNotification> notifications =
                    repository.findByUsernameAndStatusAndIsDeletedFalse(
                            username,
                            ReadStatus.UNREAD
                    );

            if (notifications.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            LocalDateTime now = LocalDateTime.now();

            notifications.forEach(notification -> {
                notification.setStatus(ReadStatus.READ);
                notification.setReadDate(now);
                notification.setUpdatedDate(now);
                notification.setUpdatedBy(jwtUtil.getCurrentUsername());
            });

            repository.saveAll(notifications);

            response.setNotifications(
                    NotificationMapper.toDtoList(notifications)
            );

            return ApiResponse.success(
                    response,
                    ÄpiMessageCodes.UPDATED_SUCCESSFULLY.toString()
            );

        } catch (Exception e) {

            log.error("Error occurred while marking all notifications as read : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }


    private MessageNotification toEntity(NotificationRequest r) {
        MessageNotification n = new MessageNotification();
        n.setUsername(r.getUsername());
        n.setTitle(r.getTitle());
        n.setMessage(r.getMessage());
        n.setAction(r.getAction());
        n.setReferenceId(r.getReferenceId());
        n.setMetadata(r.getMetadata());
        n.setStatus(ReadStatus.UNREAD);
        n.setCreatedDate(LocalDateTime.now());
        n.setCreatedBy(r.getCreatedBy());
        n.setIsActive(true);
        n.setIsDeleted(false);
        return n;
    }
}