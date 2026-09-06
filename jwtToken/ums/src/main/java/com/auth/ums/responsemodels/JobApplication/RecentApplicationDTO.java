package com.auth.ums.responsemodels.JobApplication;

import com.auth.ums.enums.ApplicationStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RecentApplicationDTO {

    private Long id;

    @JsonProperty("applicant_name")
    private String applicantName;

    @JsonProperty("job_title")
    private String jobTitle;

    @JsonProperty("status")
    private ApplicationStatus status;

    @JsonProperty("applied_date")
    private LocalDateTime appliedDate;

    @JsonProperty("category")
    private String category;

    @JsonProperty("description")
    private String description;

    @JsonProperty("job_id")
    private Long jobId;
}
