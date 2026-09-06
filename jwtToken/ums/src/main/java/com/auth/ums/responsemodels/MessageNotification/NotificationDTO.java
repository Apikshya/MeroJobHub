package com.auth.ums.responsemodels.MessageNotification;

import com.auth.ums.enums.NotificationAction;
import com.auth.ums.enums.ReadStatus;
import com.auth.ums.responsemodels.BaseDTO;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
@Data
public class NotificationDTO extends BaseDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("username")
    private String username;

    @JsonProperty("title")
    private String title;

    @JsonProperty("message")
    private String message;

    @JsonProperty("action")
    private NotificationAction action;

    @JsonProperty("status")
    private ReadStatus status;

    @JsonProperty("reference_id")
    private String referenceId;

    @JsonProperty("created_date")
    private LocalDateTime createdDate;

    @JsonProperty("read_date")
    private LocalDateTime readDate;
}
