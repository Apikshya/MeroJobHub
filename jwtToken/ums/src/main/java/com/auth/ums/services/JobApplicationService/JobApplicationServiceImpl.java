package com.auth.ums.services.JobApplicationService;
import com.auth.ums.enums.ApplicationStatus;
import com.auth.ums.enums.NotificationAction;
import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.mapper.JobApplicationMapper;
import com.auth.ums.models.Job;
import com.auth.ums.models.JobApplication;
import com.auth.ums.models.User;
import com.auth.ums.repository.JobApplicationRepository;
import com.auth.ums.repository.JobRepository;
import com.auth.ums.repository.UserRepository;
import com.auth.ums.requestmodels.JobApplicationRequestModel.AddJobApplicationRequest;
import com.auth.ums.requestmodels.JobApplicationRequestModel.DeleteJobApplicationRequest;
import com.auth.ums.requestmodels.JobApplicationRequestModel.UpdateJobApplicationRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.JobApplication.JobApplicationResponse;
import com.auth.ums.responsemodels.JobApplication.RecentApplicationDTO;
import com.auth.ums.services.MessageNotification.MessageNotificationService;
import com.auth.ums.utility.JsonUtils;
import com.auth.ums.configs.ÄpiMessageCodes;
import com.auth.ums.utility.NotificationHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    private static final Logger log =
            LoggerFactory.getLogger(JobApplicationServiceImpl.class);
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    MessageNotificationService notificationService;

    @Override
    public ApiResponse<JobApplicationResponse> addJobApplication(AddJobApplicationRequest request) {

        log.info("Add Job Application : {}", JsonUtils.toJson(request));

        JobApplicationResponse response = new JobApplicationResponse();

        try {

            JobApplication entity = JobApplicationMapper.addJobApplication(request);


            entity.setCreatedBy(jwtUtil.getCurrentUsername());
            entity.setCreatedDate(LocalDateTime.now());
            entity.setIsActive(true);
            entity.setIsDeleted(false);


            Optional<Job> optional = jobRepository.findById(request.getJobId());

            if (optional.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            if (optional.get().getIsDeleted()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            if (jobApplicationRepository.existsByApplicantIdAndJobIdAndIsDeletedFalse(
                    request.getApplicantId(), request.getJobId())) {
                return ApiResponse.failure("You have already applied for this job");
            }

            entity.setCompanyCode(optional.get().getCompanyCode());

            jobApplicationRepository.save(entity);

            response.setJobApplication(JobApplicationMapper.toDto(entity));

            notificationService.push(NotificationHelper.jobApplied(jwtUtil.getCurrentUsername(),""));
            return ApiResponse.success(response,
                    ÄpiMessageCodes.CREATED_SUCCESSFULLY.toString());

        } catch (Exception e) {

            log.error("Error : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }


    @Override
    public ApiResponse<JobApplicationResponse> updateJobApplication(UpdateJobApplicationRequest request) {

        log.info("Update Job Application : {}", JsonUtils.toJson(request));

        JobApplicationResponse response = new JobApplicationResponse();

        try {

            Optional<JobApplication> optional =
                    jobApplicationRepository.findById(request.getApplicationId());

            if (optional.isEmpty() || optional.get().getIsDeleted()) {
                return ApiResponse.failure(
                        ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            JobApplication entity = optional.get();

            JobApplicationMapper.updateJobApplication(entity, request);

            entity.setUpdatedBy(jwtUtil.getCurrentUsername());
            entity.setUpdatedDate(LocalDateTime.now());

            Optional<Job> job = jobRepository.findById(request.getJobId());

            if (job.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            if (job.get().getIsDeleted()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }
            entity.setCompanyCode(job.get().getCompanyCode());

            jobApplicationRepository.save(entity);

            response.setJobApplication(JobApplicationMapper.toDto(entity));

            Optional<Job> jobs = jobRepository.findById(entity.getJobId());

            notificationService.push(NotificationHelper.jobStatusUpdated(jwtUtil.getCurrentUsername()
                    ,jobs.get().getTitle()
                    ,request.getStatus().toString()
                    , NotificationAction.APPLICATION_UPDATED
            ));

            notificationService.push(NotificationHelper.jobStatusUpdated(entity.getApplicantEmail()
                    ,jobs.get().getTitle()
                    ,request.getStatus().toString()
                    , NotificationAction.APPLICATION_UPDATED
            ));

            return ApiResponse.success(response,
                    ÄpiMessageCodes.UPDATED_SUCCESSFULLY.toString());

        } catch (Exception e) {

            log.error("Error : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<JobApplicationResponse> getJobApplicationById(Long id) {
        log.info("Update Job Application : {}", JsonUtils.toJson(id));

        JobApplicationResponse response = new JobApplicationResponse();

        try {

            Optional<JobApplication> optional =
                    jobApplicationRepository.findById(id);

            if (optional.isEmpty() || optional.get().getIsDeleted()) {
                return ApiResponse.failure(
                        ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            response.setJobApplication(JobApplicationMapper.toDto(optional.get()));

            return ApiResponse.success(response,
                    ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());

        } catch (Exception e) {
            log.error("Error : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<JobApplicationResponse> getAllJobApplication() {
        log.info("Fetching all jobApplication");

        JobApplicationResponse response = new JobApplicationResponse();

        try {

            Optional<User> loggedInUserInfo = userRepository.findByEmailAndIsActive(jwtUtil.getCurrentUsername(), true);
            User loggedInData = loggedInUserInfo.get();

            List<JobApplication> applications =
                    jobApplicationRepository.findAll()
                            .stream()
                            .filter(application -> !application.getIsDeleted())
                            .toList();

            if (applications.isEmpty()) {
                return ApiResponse.failure(
                        ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }
            if (loggedInData.getUserType().equals("ADMIN")) {

                response.setJobApplications(
                        JobApplicationMapper.toDtoList(applications));
            }
           else if (loggedInData.getUserType().equals("CUSTOMER")) {

                response.setJobApplications(
                        JobApplicationMapper.toDtoList(applications));
            }
            else if (loggedInData.getUserType().equals("COMPANY_ADMIN")) {

                List<JobApplication> jobApplications = applications.stream()
                        .filter(jobs -> jobs.getCompanyCode().equals(loggedInData.getSystemCode()))
                        .toList();

                if (jobApplications.isEmpty()) {
                    return ApiResponse.failure("No List Found For This Company");
                }
                response.setJobApplications(
                        JobApplicationMapper.toDtoList(jobApplications));
            }
            return ApiResponse.success(response,
                    ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());

        } catch (Exception e) {
            log.error("Error : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }
    @Override
    public ApiResponse<JobApplicationResponse> getAllMyJobApplications() {

        log.info("Fetching logged-in user's job applications");

        JobApplicationResponse response = new JobApplicationResponse();

        try {

            String username = jwtUtil.getCurrentUsername();

            List<Object[]> applications =
                    jobApplicationRepository.getAllMyJobApplications(username);

            if (applications.isEmpty()) {
                response.setRecentApplications(List.of());
                return ApiResponse.success(
                        response,
                        ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString()
                );
            }

            List<RecentApplicationDTO> applicationList = applications.stream()
                    .map(row -> {

                        RecentApplicationDTO dto = new RecentApplicationDTO();

                        dto.setId(((Number) row[0]).longValue());
                        dto.setApplicantName((String) row[1]);
                        dto.setJobTitle((String) row[2]);
                        dto.setStatus(ApplicationStatus.valueOf(row[3].toString()));
                        dto.setAppliedDate((LocalDateTime) row[4]);
                        dto.setCategory((String) row[5]);
                        dto.setDescription((String) row[6]);
                        if (row.length > 7 && row[7] != null) {
                            dto.setJobId(((Number) row[7]).longValue());
                        }

                        return dto;
                    })
                    .toList();

            response.setRecentApplications(applicationList);

            return ApiResponse.success(
                    response,
                    ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString()
            );

        } catch (Exception e) {

            log.error("Error while fetching logged-in user's applications : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }


    @Override
    public ApiResponse<JobApplicationResponse> deleteJobApplication(DeleteJobApplicationRequest request) {
        log.info("Update Job Application : {}", JsonUtils.toJson(request));

        JobApplicationResponse response = new JobApplicationResponse();

        try {

            Optional<JobApplication> optional =
                    jobApplicationRepository.findById(request.getId());

            if (optional.isEmpty() || optional.get().getIsDeleted()) {
                return ApiResponse.failure(
                        ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            JobApplication entity = optional.get();

            JobApplicationMapper.deleteJobApplication(entity, request);

            entity.setUpdatedBy(jwtUtil.getCurrentUsername());
            entity.setUpdatedDate(LocalDateTime.now());
            entity.setIsDeleted(true);
            entity.setIsActive(false);

            jobApplicationRepository.save(entity);

            response.setJobApplication(JobApplicationMapper.toDto(entity));

            Optional<Job> jobs = jobRepository.findById(entity.getJobId());

            notificationService.push(NotificationHelper.jobStatusUpdated(jwtUtil.getCurrentUsername()
                    ,jobs.get().getTitle()
                    ,"DELETED"
                    , NotificationAction.APPLICATION_UPDATED
            ));

            notificationService.push(NotificationHelper.jobStatusUpdated(entity.getApplicantEmail()
                    ,jobs.get().getTitle()
                    ,"DELETED"
                    , NotificationAction.APPLICATION_UPDATED
            ));

            return ApiResponse.success(response,
                    ÄpiMessageCodes.DELETED_SUCCESSFULLY.toString());

        } catch (Exception e) {
            log.error("Error : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }
    @Override
    public ApiResponse<JobApplicationResponse> getRecentApplications() {

        log.info("Fetching recent job applications");

        JobApplicationResponse response = new JobApplicationResponse();

        try {

            List<Object[]> applications =
                    jobApplicationRepository.getRecentApplications();


            if (applications.isEmpty()) {
                return ApiResponse.failure(
                        ÄpiMessageCodes.NO_RESULT_FOUND.toString()
                );
            }


            List<RecentApplicationDTO> recentApplications =
                    applications.stream()
                            .map(row -> {

                                RecentApplicationDTO dto =
                                        new RecentApplicationDTO();

                                dto.setId(
                                        ((Number) row[0]).longValue()
                                );

                                dto.setApplicantName(
                                        row[1] != null ? row[1].toString() : null
                                );

                                dto.setJobTitle(
                                        row[2] != null ? row[2].toString() : null
                                );

                                dto.setStatus(
                                        row[3] != null
                                                ? ApplicationStatus.valueOf(row[3].toString())
                                                : null
                                );

                                if (row[4] != null) {
                                    dto.setAppliedDate((LocalDateTime) row[4]);
                                }

                                return dto;

                            })
                            .toList();


            response.setRecentApplications(recentApplications);


            return ApiResponse.success(
                    response,
                    ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString()
            );


        } catch (Exception e) {

            log.error("Error while fetching recent applications : {}",
                    e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }


}

