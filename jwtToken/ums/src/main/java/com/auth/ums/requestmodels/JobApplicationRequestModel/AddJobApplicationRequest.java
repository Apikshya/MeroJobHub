package com.auth.ums.requestmodels.JobApplicationRequestModel;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddJobApplicationRequest {

    @NotNull(message = "Job Id is Required")
    @JsonProperty("job_Id")
    private Long jobId;

    @NotNull(message = "Applicant Id is Required")
    @JsonProperty("applicant_Id")
    private Long applicantId;

    @NotBlank(message = "Applicant Name is Required")
    @JsonProperty("applicant_Name")
    private String applicantName;

    @NotBlank(message = "Applicant Email is Required")
    @Email(message = "Invalid Email Format")
    @JsonProperty("applicant_Email")
    private String applicantEmail;

    @NotBlank(message = "Applicant Phone is Required")
    @JsonProperty("applicant_Phone")
    private String applicantPhone;

   //@NotBlank(message = "Resume File Name is Required")
    @JsonProperty("resume_File_Name")
    private String resumeFileName;

    @JsonProperty("cover_Letter")
    private String coverLetter;
}
