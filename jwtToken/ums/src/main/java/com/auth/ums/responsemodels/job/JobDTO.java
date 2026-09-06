package com.auth.ums.responsemodels.job;

import com.auth.ums.enums.JobStatus;
import com.auth.ums.enums.JobType;
import com.auth.ums.responsemodels.BaseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class JobDTO extends BaseDTO {

    private Long id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("description")
    private String description;

    @JsonProperty("company_name")
    private String companyName;

    @JsonProperty("location")
    private String location;

    @JsonProperty("job_type")
    private JobType jobType;

    @JsonProperty("category")
    private String category;

    @JsonProperty("experience_required")
    private String experienceRequired;

    @JsonProperty("qualification")
    private String qualification;

    @JsonProperty("skills_required")
    private String skillsRequired;

    @JsonProperty("min_salary")
    private BigDecimal minSalary;

    @JsonProperty("max_salary")
    private BigDecimal maxSalary;

    @JsonProperty("vacancy_count")
    private Integer vacancyCount;

    @JsonProperty("posted_date")
    private LocalDateTime postedDate;

    @JsonProperty("expiry_date")
    private LocalDateTime expiryDate;

    @JsonProperty("status")
    private JobStatus status;
}
