package com.auth.ums.responsemodels.JobApplication;

import com.auth.ums.responsemodels.BaseDTO;
import com.auth.ums.enums.ApplicationStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class JobApplicationDTO extends BaseDTO {

    private Long id;

    @JsonProperty("job_id")
    private Long jobId;

    @JsonProperty("applicant_id")
    private Long applicantId;

    @JsonProperty("applicant_name")
    private String applicantName;

    @JsonProperty("applicant_email")
    private String applicantEmail;

    @JsonProperty("applicant_phone")
    private String applicantPhone;

    @JsonProperty("resume_file_name")
    private String resumeFileName;

    @JsonProperty("cover_letter")
    private String coverLetter;

    @JsonProperty("status")
    private ApplicationStatus status;

}