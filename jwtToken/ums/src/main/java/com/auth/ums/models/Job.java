package com.auth.ums.models;

import com.auth.ums.enums.JobStatus;
import com.auth.ums.enums.JobType;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "job")
public class Job extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "location", nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false, length = 20)
    private JobType jobType;

    @Column(name = "category")
    private String category;

    @Column(name = "experience_required")
    private String experienceRequired;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "skills_required")
    private String skillsRequired;

    @Column(name = "min_salary", precision = 12, scale = 2)
    private BigDecimal minSalary;

    @Column(name = "max_salary", precision = 12, scale = 2)
    private BigDecimal maxSalary;

    @Column(name = "vacancy_count", nullable = false)
    private Integer vacancyCount = 1;

    @Column(name = "posted_date", nullable = false, updatable = false)
    private LocalDateTime postedDate = LocalDateTime.now();

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private JobStatus status = JobStatus.OPEN;

    @Column(name = "company_code")
    private String companyCode;

    /**
     * Auto-flip status to EXPIRED whenever the entity is loaded/updated
     * and the expiry date has already passed. The authoritative sweep
     * still happens via the scheduled job (see JobExpiryScheduler),
     * this is just a safety net for reads/writes in between runs.
     */
    @PrePersist
    @PreUpdate
    public void syncStatusWithExpiry() {
        if (expiryDate != null
                && expiryDate.isBefore(LocalDateTime.now())
                && status == JobStatus.OPEN) {
            this.status = JobStatus.EXPIRED;
        }
    }
}
