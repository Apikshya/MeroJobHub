package com.auth.ums.mapper;
import com.auth.ums.models.Job;
import com.auth.ums.requestmodels.JobRequestModel.AddJobRequest;
import com.auth.ums.requestmodels.JobRequestModel.DeleteJobRequest;
import com.auth.ums.requestmodels.JobRequestModel.UpdateJobRequest;
import com.auth.ums.responsemodels.job.JobDTO;

import java.util.List;
import java.util.stream.Collectors;

public class JobMapper {

    // Add Job (Request → Entity)
    public static Job addJob(AddJobRequest request) {
        if (request == null) {
            return null;
        }

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setCategory(request.getCategory());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setQualification(request.getQualification());
        job.setSkillsRequired(request.getSkillsRequired());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setVacancyCount(request.getVacancyCount());
        job.setExpiryDate(request.getExpiryDate());

        return job;
    }

    // Update Job (Request → Existing Entity)
    public static Job updateJob(Job job, UpdateJobRequest request) {
        if (request == null) {
            return null;
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setCategory(request.getCategory());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setQualification(request.getQualification());
        job.setSkillsRequired(request.getSkillsRequired());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setVacancyCount(request.getVacancyCount());
        job.setExpiryDate(request.getExpiryDate());
        job.setStatus(request.getStatus());

        return job;
    }

    // Delete Job (Soft Delete)
    public static Job deleteJob(Job job, DeleteJobRequest request) {
        if (request == null) {
            return null;
        }

        job.setRemarks(request.getRemarks());

        return job;
    }

    // Job → JobDTO
    public static JobDTO toDto(Job job) {
        if (job == null) {
            return null;
        }

        JobDTO dto = new JobDTO();

        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setCompanyName(job.getCompanyName());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setCategory(job.getCategory());
        dto.setExperienceRequired(job.getExperienceRequired());
        dto.setQualification(job.getQualification());
        dto.setSkillsRequired(job.getSkillsRequired());
        dto.setMinSalary(job.getMinSalary());
        dto.setMaxSalary(job.getMaxSalary());
        dto.setVacancyCount(job.getVacancyCount());
        dto.setPostedDate(job.getPostedDate());
        dto.setExpiryDate(job.getExpiryDate());
        dto.setStatus(job.getStatus());

        return dto;
    }

    // List<Job> → List<JobDTO>
    public static List<JobDTO> toDtoList(List<Job> jobs) {
        if (jobs == null) {
            return List.of();
        }

        return jobs.stream()
                .map(JobMapper::toDto)
                .collect(Collectors.toList());
    }

}
