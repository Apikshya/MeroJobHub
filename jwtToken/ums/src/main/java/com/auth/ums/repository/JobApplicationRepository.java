package com.auth.ums.repository;


import com.auth.ums.models.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication,Long> {
    @Query(value = """
        SELECT
            COUNT(id) AS total_applications,
            COUNT(id) FILTER (WHERE status = 'APPLIED') AS applied,
            COUNT(id) FILTER (WHERE status = 'SHORTLISTED') AS shortlisted,
            COUNT(id) FILTER (WHERE status = 'SELECTED') AS selected,
            COUNT(id) FILTER (WHERE status = 'REJECTED') AS rejected,
            COUNT(id) FILTER (WHERE status = 'WITHDRAWN') AS withdrawn
        FROM job_application
        WHERE is_deleted = false
        """, nativeQuery = true)
    Object[] getApplicationCounts();

    @Query(value = """
                       SELECT
                                ja.id,
                                CONCAT(u.first_name, ' ', u.last_name) AS applicant_name,
                                j.title AS job_title,
                                ja.status,
                                ja.created_date AS applied_date
                            FROM job_application ja
                            JOIN users u ON u.id = ja.applicant_id
                            JOIN job j ON j.id = ja.job_id
                            WHERE ja.is_deleted = false
                            ORDER BY ja.created_date DESC
                            LIMIT 10
        """, nativeQuery = true)
    List<Object[]> getRecentApplications();

    @Query(value = """
        SELECT
            ja.id,
            CONCAT(u.first_name, ' ', u.last_name) AS applicant_name,
            j.title AS job_title,
            ja.status,
            ja.created_date AS applied_date,
            j.category ,
            j.description,
            ja.job_id
        FROM job_application ja
        JOIN users u ON u.id = ja.applicant_id
        JOIN job j ON j.id = ja.job_id
        WHERE ja.is_deleted = false
          AND u.email = :username
        ORDER BY ja.created_date DESC
        """, nativeQuery = true)
    List<Object[]> getAllMyJobApplications(@Param("username") String username);

    boolean existsByApplicantIdAndJobIdAndIsDeletedFalse(Long applicantId, Long jobId);

}
