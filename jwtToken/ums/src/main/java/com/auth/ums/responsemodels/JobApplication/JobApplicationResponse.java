package com.auth.ums.responsemodels.JobApplication;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class JobApplicationResponse {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("job_application")
    private JobApplicationDTO jobApplication;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("job_applications")
    private List<JobApplicationDTO> jobApplications;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("recent_applications")
    private List<RecentApplicationDTO> recentApplications;
}
