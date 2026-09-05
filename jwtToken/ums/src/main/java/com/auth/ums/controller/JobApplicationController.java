package com.auth.ums.controller;

import com.auth.ums.requestmodels.JobApplicationRequestModel.AddJobApplicationRequest;
import com.auth.ums.requestmodels.JobApplicationRequestModel.DeleteJobApplicationRequest;
import com.auth.ums.requestmodels.JobApplicationRequestModel.UpdateJobApplicationRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.JobApplication.JobApplicationResponse;
import com.auth.ums.services.JobApplicationService.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/job-application")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> addJobApplication(@Valid @RequestBody AddJobApplicationRequest request) {
        return ResponseEntity.ok(jobApplicationService.addJobApplication(request));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> updateJobApplication(@Valid @RequestBody UpdateJobApplicationRequest request) {
        return ResponseEntity.ok(jobApplicationService.updateJobApplication(request));
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getJobApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(jobApplicationService.getJobApplicationById(id));
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getAllJobApplication() {
        return ResponseEntity.ok(jobApplicationService.getAllJobApplication());
    }

    @GetMapping("/get-my-applications")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getAllMyJobApplications() {
        return ResponseEntity.ok(jobApplicationService.getAllMyJobApplications());
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> deleteJobApplication(@Valid @RequestBody DeleteJobApplicationRequest request) {
        return ResponseEntity.ok(jobApplicationService.deleteJobApplication(request));
    }
}
