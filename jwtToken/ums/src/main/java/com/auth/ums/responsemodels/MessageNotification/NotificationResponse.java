package com.auth.ums.responsemodels.MessageNotification;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class NotificationResponse {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("dto")
    private NotificationDTO notification;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("dtos")
    private List<NotificationDTO> notifications;

}