package com.auth.ums.services.JobApplicationService;
import com.auth.ums.requestmodels.JobApplicationRequestModel.AddJobApplicationRequest;
import com.auth.ums.requestmodels.JobApplicationRequestModel.DeleteJobApplicationRequest;
import com.auth.ums.requestmodels.JobApplicationRequestModel.UpdateJobApplicationRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.JobApplication.JobApplicationResponse;

public interface JobApplicationService {
    ApiResponse<JobApplicationResponse> addJobApplication(AddJobApplicationRequest request);

    ApiResponse<JobApplicationResponse> updateJobApplication(UpdateJobApplicationRequest request);

    ApiResponse<JobApplicationResponse> getJobApplicationById(Long id);

    ApiResponse<JobApplicationResponse> getAllJobApplication();
    ApiResponse<JobApplicationResponse> getAllMyJobApplications();
    ApiResponse<JobApplicationResponse> getRecentApplications();

    ApiResponse<JobApplicationResponse> deleteJobApplication(DeleteJobApplicationRequest request);

}
