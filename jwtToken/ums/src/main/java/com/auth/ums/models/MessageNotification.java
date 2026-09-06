package com.auth.ums.models;

import com.auth.ums.enums.NotificationAction;
import com.auth.ums.enums.ReadStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "message_notification")
public class MessageNotification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Column(name = "title", length = 500)
    private String title;

    @Column(name = "message", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 40)
    private NotificationAction action;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    private ReadStatus status = ReadStatus.UNREAD;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Column(name = "metadata")
    private String metadata;

    @Column(name = "read_date")
    private LocalDateTime readDate;
}
