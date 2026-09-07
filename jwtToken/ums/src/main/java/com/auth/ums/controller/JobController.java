package com.auth.ums.controller;


import com.auth.ums.requestmodels.JobRequestModel.AddJobRequest;
import com.auth.ums.requestmodels.JobRequestModel.DeleteJobRequest;
import com.auth.ums.requestmodels.JobRequestModel.UpdateJobRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.job.JobResponse;
import com.auth.ums.services.JobService.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/job")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<JobResponse>> addJob(@Valid @RequestBody AddJobRequest request) {
        return ResponseEntity.ok(jobService.addJob(request));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(@Valid @RequestBody UpdateJobRequest request) {
        return ResponseEntity.ok(jobService.updateJob(request));
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<JobResponse>> getAllJob() {

        return ResponseEntity.ok(jobService.getAllJob());
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<JobResponse>> deleteJob(@Valid @RequestBody DeleteJobRequest request) {
        return ResponseEntity.ok(jobService.deleteJob(request));
    }

}
