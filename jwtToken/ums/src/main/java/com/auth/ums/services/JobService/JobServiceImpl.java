package com.auth.ums.services.JobService;
import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.mapper.JobMapper;
import com.auth.ums.models.Job;
import com.auth.ums.models.User;
import com.auth.ums.repository.JobRepository;
import com.auth.ums.repository.UserRepository;
import com.auth.ums.requestmodels.JobRequestModel.AddJobRequest;
import com.auth.ums.requestmodels.JobRequestModel.DeleteJobRequest;
import com.auth.ums.requestmodels.JobRequestModel.UpdateJobRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.job.JobResponse;
import com.auth.ums.services.MessageNotification.MessageNotificationService;
import com.auth.ums.utility.JsonUtils;
import com.auth.ums.configs.ÄpiMessageCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JobServiceImpl implements JobService {
    private static final Logger log = LoggerFactory.getLogger(JobServiceImpl.class);
    @Autowired
    UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    MessageNotificationService notificationService;
    @Autowired
    private JobRepository jobRepository;

    @Override
    public ApiResponse<JobResponse> addJob(AddJobRequest request) {
        log.info("Request received to add job : {}", JsonUtils.toJson(request));

        JobResponse response = new JobResponse();

        try {
            Optional<User> loggedInUserInfo = userRepository.findByEmailAndIsActive(jwtUtil.getCurrentUsername(), true);
            User loggedInData = loggedInUserInfo.get();

            // Check if Job Title already exists
            Optional<Job> optional = jobRepository.findByTitle(request.getTitle());

            if (optional.isPresent()) {
                log.warn("Job Title already exists : {}", request.getTitle());
                return ApiResponse.failure("Job Title is Already Used");
            }

            Job entity = new Job();
            entity = JobMapper.addJob(request);

            if (loggedInData.getUserType().equals("ADMIN")) {
                entity.setCompanyCode(request.getCompanyCode());
            } else if (loggedInData.getUserType().equals("COMPANY_ADMIN")) {
                entity.setCompanyCode(loggedInData.getSystemCode());
            }


            entity.setCreatedBy(jwtUtil.getCurrentUsername());
            entity.setCreatedDate(LocalDateTime.now());
            entity.setIsActive(true);
            entity.setIsDeleted(false);

            jobRepository.save(entity);

            response.setJob(JobMapper.toDto(entity));

            log.info("Job created successfully : {}", JsonUtils.toJson(entity));

            return ApiResponse.success(response,
                    ÄpiMessageCodes.CREATED_SUCCESSFULLY.toString());

        } catch (Exception e) {

            log.error("Error occurred while adding Job : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<JobResponse> updateJob(UpdateJobRequest request) {

        log.info("Request received to update job : {}", JsonUtils.toJson(request));

        JobResponse response = new JobResponse();

        try {
            Optional<User> loggedInUserInfo = userRepository.findByEmailAndIsActive(jwtUtil.getCurrentUsername(), true);
            User loggedInData = loggedInUserInfo.get();

            Optional<Job> optional = jobRepository.findById(request.getId());

            if (optional.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            if (optional.get().getIsDeleted()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            Job entity = optional.get();

            entity = JobMapper.updateJob(entity, request);
            if (loggedInData.getUserType().equals("ADMIN")) {
                entity.setCompanyCode(request.getCompanyCode());
            } else if (loggedInData.getUserType().equals("COMPANY_ADMIN")) {
                entity.setCompanyCode(loggedInData.getSystemCode());
            }
            entity.setUpdatedBy(jwtUtil.getCurrentUsername());
            entity.setUpdatedDate(LocalDateTime.now());

            jobRepository.save(entity);

            response.setJob(JobMapper.toDto(entity));

            return ApiResponse.success(response,
                    ÄpiMessageCodes.UPDATED_SUCCESSFULLY.toString());

        } catch (Exception e) {

            log.error("Error occurred while updating job : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<JobResponse> getJobById(Long id) {

        log.info("Fetching job by id : {}", id);

        JobResponse response = new JobResponse();

        try {

            Optional<Job> optional = jobRepository.findById(id);

            if (optional.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            if (optional.get().getIsDeleted()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            response.setJob(JobMapper.toDto(optional.get()));

            return ApiResponse.success(response,
                    ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());

        } catch (Exception e) {

            log.error("Error : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<JobResponse> getAllJob() {

        log.info("Fetching all jobs");

        JobResponse response = new JobResponse();
        Optional<User> loggedInUserInfo = userRepository.findByEmailAndIsActive(jwtUtil.getCurrentUsername(), true);
        User loggedInData = loggedInUserInfo.get();
        try {

            List<Job> jobs = jobRepository.findAll()
                    .stream()
                    .filter(job -> !job.getIsDeleted())
                    .toList();

            if (jobs.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }


            if (loggedInData.getUserType().equals("ADMIN")) {
                response.setJobs(JobMapper.toDtoList(jobs));

            } else if (loggedInData.getUserType().equals("CUSTOMER")) {
                response.setJobs(JobMapper.toDtoList(jobs));

            }
            else if (loggedInData.getUserType().equals("COMPANY_ADMIN")) {

                List<Job> companyJobs=jobs.stream().filter(comp -> comp.getCompanyCode().equals(loggedInData.getSystemCode()))
                        .toList();

                if (companyJobs.isEmpty()) {
                    return ApiResponse.failure("No List Found For This Company");
                }
                response.setJobs(JobMapper.toDtoList(companyJobs));
            }
            return ApiResponse.success(response,
                    ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());

        } catch (Exception e) {

            log.error("Error : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<JobResponse> deleteJob(DeleteJobRequest request) {

        log.info("Deleting Job : {}", JsonUtils.toJson(request));

        JobResponse response = new JobResponse();

        try {

            Optional<Job> optional = jobRepository.findById(request.getId());

            if (optional.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }
            if (optional.get().getIsDeleted()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }

            Job entity = optional.get();

            entity = JobMapper.deleteJob(entity, request);

            entity.setUpdatedBy(jwtUtil.getCurrentUsername());
            entity.setUpdatedDate(LocalDateTime.now());
            entity.setIsActive(false);
            entity.setIsDeleted(true);

            jobRepository.save(entity);

            response.setJob(JobMapper.toDto(entity));

            return ApiResponse.success(response,
                    ÄpiMessageCodes.DELETED_SUCCESSFULLY.toString());

        } catch (Exception e) {

            log.error("Error : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }
}
