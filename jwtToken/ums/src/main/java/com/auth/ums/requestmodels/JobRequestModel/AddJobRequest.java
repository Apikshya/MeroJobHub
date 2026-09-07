package com.auth.ums.requestmodels.JobRequestModel;

import com.auth.ums.enums.JobType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AddJobRequest {

    @NotBlank(message = "Title is Required")
    @JsonProperty("title")
    private String title;

    @NotBlank(message = "Description is Required")
    @JsonProperty("description")
    private String description;

    @NotBlank(message = "Company Name is Required")
    @JsonProperty("company_Name")
    private String companyName;

    @NotBlank(message = "Location is Required")
    @JsonProperty("location")
    private String location;

    @NotNull(message = "Job Type is Required")
    @JsonProperty("job_Type")
    private JobType jobType;

    @JsonProperty("category")
    private String category;

    @JsonProperty("experience_Required")
    private String experienceRequired;

    @JsonProperty("qualification")
    private String qualification;

    @JsonProperty("skills_Required")
    private String skillsRequired;

    @DecimalMin(value = "0.0", inclusive = true, message = "Minimum Salary cannot be negative")
    @JsonProperty("min_Salary")
    private BigDecimal minSalary;

    @DecimalMin(value = "0.0", inclusive = true, message = "Maximum Salary cannot be negative")
    @JsonProperty("max_Salary")
    private BigDecimal maxSalary;

    @NotNull(message = "Vacancy Count is Required")
    @Min(value = 1, message = "Vacancy Count must be at least 1")
    @JsonProperty("vacancy_Count")
    private Integer vacancyCount;

    @NotNull(message = "Expiry Date is Required")
    @JsonProperty("expiry_Date")
    private LocalDateTime expiryDate;

    @JsonProperty("company_code")
    private String companyCode;
}