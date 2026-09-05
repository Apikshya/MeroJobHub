package com.auth.ums.mapper;
import com.auth.ums.models.JobApplication;
import com.auth.ums.requestmodels.JobApplicationRequestModel.AddJobApplicationRequest;
import com.auth.ums.requestmodels.JobApplicationRequestModel.DeleteJobApplicationRequest;
import com.auth.ums.requestmodels.JobApplicationRequestModel.UpdateJobApplicationRequest;
import com.auth.ums.responsemodels.JobApplication.JobApplicationDTO;

import java.util.List;
import java.util.stream.Collectors;

public class JobApplicationMapper {

    // Add Job Application (Request → Entity)
    public static JobApplication addJobApplication(AddJobApplicationRequest request) {
        if (request == null) {
            return null;
        }

        JobApplication application = new JobApplication();

        application.setJobId(request.getJobId());
        application.setApplicantId(request.getApplicantId());
        application.setApplicantName(request.getApplicantName());
        application.setApplicantEmail(request.getApplicantEmail());
        application.setApplicantPhone(request.getApplicantPhone());
        application.setResumeFileName(request.getResumeFileName());
        application.setCoverLetter(request.getCoverLetter());

        return application;
    }

    // Update Job Application (Request → Existing Entity)
    public static JobApplication updateJobApplication(JobApplication application, UpdateJobApplicationRequest request) {

        if (request == null) {
            return null;
        }

        application.setJobId(request.getJobId());
        application.setApplicantId(request.getApplicantId());
        application.setApplicantName(request.getApplicantName());
        application.setApplicantEmail(request.getApplicantEmail());
        application.setApplicantPhone(request.getApplicantPhone());
        application.setResumeFileName(request.getResumeFileName());
        application.setCoverLetter(request.getCoverLetter());
        application.setStatus(request.getStatus());

        return application;
    }

    // Delete Job Application (Soft Delete)
    public static JobApplication deleteJobApplication(JobApplication application, DeleteJobApplicationRequest request) {

        if (request == null) {
            return null;
        }

        application.setRemarks(request.getRemarks());

        return application;
    }

    // Entity → DTO
    public static JobApplicationDTO toDto(JobApplication application) {

        if (application == null) {
            return null;
        }

        JobApplicationDTO dto = new JobApplicationDTO();

        dto.setId(application.getId());
        dto.setJobId(application.getJobId());
        dto.setApplicantId(application.getApplicantId());
        dto.setApplicantName(application.getApplicantName());
        dto.setApplicantEmail(application.getApplicantEmail());
        dto.setApplicantPhone(application.getApplicantPhone());
        dto.setResumeFileName(application.getResumeFileName());
        dto.setCoverLetter(application.getCoverLetter());
        dto.setStatus(application.getStatus());

        return dto;
    }

    // Entity List → DTO List
    public static List<JobApplicationDTO> toDtoList(List<JobApplication> applications) {

        if (applications == null) {
            return List.of();
        }

        return applications.stream()
                .map(JobApplicationMapper::toDto)
                .collect(Collectors.toList());
    }

}
