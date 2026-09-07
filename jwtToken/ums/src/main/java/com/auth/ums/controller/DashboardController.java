package com.auth.ums.controller;
import com.auth.ums.configs.ApiResponseCodes;
import com.auth.ums.enums.ApplicationStatus;
import com.auth.ums.enums.JobStatus;
import com.auth.ums.responsemodels.JobApplication.JobApplicationDTO;
import com.auth.ums.responsemodels.job.JobDTO;
import com.auth.ums.services.Company.CompanyService;
import com.auth.ums.services.JobApplicationService.JobApplicationService;
import com.auth.ums.services.JobService.JobService;
import com.auth.ums.services.UserService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {


    /**
     * Admin Dashboard Summary
     */
    @Autowired
    UserService userService;
    @Autowired
    CompanyService companyService;
    @Autowired
    JobService jobService;
    @Autowired
    JobApplicationService jobApplicationService;

    @GetMapping("/admin/summary")
    public ResponseEntity<?> getAdminDashboard() {

        var recentUsers=userService.getRecentUsers();
        var userCount=userService.getUserCount();

        Map<String, Object> data = new LinkedHashMap<>();
        if (userCount != null && userCount.getCode().equals(ApiResponseCodes.SUCCESS)) {
            data.put("total_customers",  userCount.getData().getTotalCustomers());
            data.put("total_company_admins", userCount.getData().getTotalCompanyAdmins());
            data.put("total_users", userCount.getData().getTotalUsers());

        }else{
            data.put("total_customers", 0);
            data.put("total_company_admins", 0);
            data.put("total_users", 0);
        }
        if (recentUsers != null && recentUsers.getCode().equals(ApiResponseCodes.SUCCESS)) {
            data.put("recent_users", recentUsers.getData().getUsers());
        }else{
            Map<String, Object> application = new LinkedHashMap<>();
            data.put("recent_applications",application);
        }

        var totalJobs = jobService.getAllJob();

        Map<String, Long> jobsByStatus = new LinkedHashMap<>();

        if (totalJobs != null && totalJobs.getCode().equals(ApiResponseCodes.SUCCESS)) {

            List<JobDTO> jobs = totalJobs.getData().getJobs();

            data.put("total_jobs", jobs.size());


            Map<JobStatus, Long> jobStatusCount = jobs.stream()
                    .collect(Collectors.groupingBy(
                            JobDTO::getStatus,
                            Collectors.counting()
                    ));
            jobsByStatus.put(
                    "OPEN",
                    jobStatusCount.getOrDefault(JobStatus.OPEN, 0L)
            );
            jobsByStatus.put(
                    "CLOSED",
                    jobStatusCount.getOrDefault(JobStatus.CLOSED, 0L)
            );
            jobsByStatus.put(
                    "EXPIRED",
                    jobStatusCount.getOrDefault(JobStatus.EXPIRED, 0L)
            );
        } else {

            data.put("total_jobs", 0);

            jobsByStatus.put("OPEN", 0L);
            jobsByStatus.put("CLOSED", 0L);
            jobsByStatus.put("EXPIRED", 0L);
        }

        data.put("jobs_by_status", jobsByStatus);



        var applications = jobApplicationService.getAllJobApplication();

        Map<String, Long> applicationsByStatus = new LinkedHashMap<>();

        if (applications != null && applications.getCode().equals(ApiResponseCodes.SUCCESS)) {

            List<JobApplicationDTO> applicationList =
                    applications.getData().getJobApplications();

            data.put("total_applications", applicationList.size());


            Map<ApplicationStatus, Long> applicationStatusCount =
                    applicationList.stream()
                            .collect(Collectors.groupingBy(
                                    JobApplicationDTO::getStatus,
                                    Collectors.counting()
                            ));


            applicationsByStatus.put(
                    "APPLIED",
                    applicationStatusCount.getOrDefault(ApplicationStatus.APPLIED, 0L)
            );

            applicationsByStatus.put(
                    "SHORTLISTED",
                    applicationStatusCount.getOrDefault(ApplicationStatus.SHORTLISTED, 0L)
            );

            applicationsByStatus.put(
                    "SELECTED",
                    applicationStatusCount.getOrDefault(ApplicationStatus.SELECTED, 0L)
            );

            applicationsByStatus.put(
                    "REJECTED",
                    applicationStatusCount.getOrDefault(ApplicationStatus.REJECTED, 0L)
            );

            applicationsByStatus.put(
                    "WITHDRAWN",
                    applicationStatusCount.getOrDefault(ApplicationStatus.WITHDRAWN, 0L)
            );
        } else {

            data.put("total_applications", 0);
            applicationsByStatus.put("APPLIED", 0L);
            applicationsByStatus.put("SHORTLISTED", 0L);
            applicationsByStatus.put("SELECTED", 0L);
            applicationsByStatus.put("REJECTED", 0L);
            applicationsByStatus.put("WITHDRAWN", 0L);
        }

        data.put("applications_by_status", applicationsByStatus);


        var totalCompanies=companyService.getAllCompanies();
        if (totalCompanies != null && totalCompanies.getCode().equals(ApiResponseCodes.SUCCESS)) {
            data.put("total_companies", totalCompanies.getData().getCompanies().size());
        }
       else{
            data.put("total_companies", 0);
        }
        var recentApplications=jobApplicationService.getRecentApplications();
        data.put("recent_applications", recentApplications.getData().getRecentApplications());

        return ResponseEntity.ok(successResponse(data));
    }



    /**
     * Company Dashboard Summary
     */
    @GetMapping("/company/summary")
    public ResponseEntity<?> getCompanyDashboard() {

        var companysummary=companyService.getMyCompany();
        Map<String, Object> data = new LinkedHashMap<>();

        data.put("company_code", companysummary.getData().getCompany().getCompanyCode());
        data.put("company_name", companysummary.getData().getCompany().getCompanyName());

        data.put("total_jobs", 9);
        data.put("open_vacancies", 23);
        data.put("total_applicants", 76);
        data.put("avg_days_to_fill", 14);


        Map<String, Integer> applications = new LinkedHashMap<>();

        applications.put("APPLIED", 40);
        applications.put("SHORTLISTED", 18);
        applications.put("SELECTED", 10);
        applications.put("REJECTED", 8);
        applications.put("WITHDRAWN", 0);


        data.put("applications_by_status", applications);



        List<Map<String, Object>> trend = new ArrayList<>();

        trend.add(Map.of(
                "week_start", "2026-06-15",
                "count", 4
        ));

        trend.add(Map.of(
                "week_start", "2026-06-22",
                "count", 7
        ));

        trend.add(Map.of(
                "week_start", "2026-06-29",
                "count", 9
        ));

        trend.add(Map.of(
                "week_start", "2026-07-06",
                "count", 12
        ));

        trend.add(Map.of(
                "week_start", "2026-07-13",
                "count", 15
        ));

        trend.add(Map.of(
                "week_start", "2026-07-20",
                "count", 19
        ));


        data.put("applications_trend", trend);


        return ResponseEntity.ok(successResponse(data));
    }




    /**
     * Customer Dashboard Summary
     */
    @GetMapping("/customer/summary")
    public ResponseEntity<?> getCustomerDashboard() {


        Map<String, Object> data = new LinkedHashMap<>();

        data.put("applications_sent", 6);
        data.put("documents_on_file", 4);
        data.put("profile_completion_percent", 85);


        Map<String, Integer> applications = new LinkedHashMap<>();

        applications.put("APPLIED", 3);
        applications.put("SHORTLISTED", 2);
        applications.put("SELECTED", 1);
        applications.put("REJECTED", 0);
        applications.put("WITHDRAWN", 0);


        data.put("applications_by_status", applications);


        return ResponseEntity.ok(successResponse(data));
    }

    private Map<String, Object> successResponse(Object data) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("code", "SUCCESS");
        response.put("message", "Fetch Successfully");
        response.put("data", data);
        response.put("timestamp", Instant.now().toString());

        return response;
    }

}
