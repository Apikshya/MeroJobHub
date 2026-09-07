package com.auth.ums.responsemodels;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseDTO {
    @JsonProperty("created_date")
    private LocalDateTime createdDate;

    @JsonProperty("created_by")
    private String createdBy;

    @JsonProperty("updated_date")
    private LocalDateTime updatedDate;

    @JsonProperty("updated_by")
    private String updatedBy;

    @JsonProperty("is_active")
    private Boolean isActive;

    @JsonProperty("remarks")
    private String remarks;
}
