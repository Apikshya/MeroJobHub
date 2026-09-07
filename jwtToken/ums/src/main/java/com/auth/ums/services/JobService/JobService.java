package com.auth.ums.services.JobService;
import com.auth.ums.requestmodels.JobRequestModel.AddJobRequest;
import com.auth.ums.requestmodels.JobRequestModel.DeleteJobRequest;
import com.auth.ums.requestmodels.JobRequestModel.UpdateJobRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.job.JobResponse;

public interface JobService {
    ApiResponse<JobResponse> addJob(AddJobRequest request);

    ApiResponse<JobResponse> updateJob(UpdateJobRequest request);

    ApiResponse<JobResponse> getJobById(Long id);

    ApiResponse<JobResponse> getAllJob();

    ApiResponse<JobResponse> deleteJob(DeleteJobRequest request);
}
