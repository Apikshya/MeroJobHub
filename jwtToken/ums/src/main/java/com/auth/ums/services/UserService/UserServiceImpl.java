package com.auth.ums.services.UserService;
import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.mapper.UserMapper;
import com.auth.ums.models.User;
import com.auth.ums.models.UserSpecification;
import com.auth.ums.repository.UserRepository;
import com.auth.ums.requestmodels.Auth.AddUserRequest;
import com.auth.ums.requestmodels.Auth.DeleteUserRequest;
import com.auth.ums.requestmodels.Auth.LoginRequest;
import com.auth.ums.requestmodels.Auth.UpdateUserRequest;
import com.auth.ums.requestmodels.Emails.EmailRequest;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.PasswordChangeByToken;
import com.auth.ums.requestmodels.ProfileModel.ChangePasswordRequest;
import com.auth.ums.requestmodels.UserRoleRequestModel.AddUserRoleRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.user.*;
import com.auth.ums.services.EmailService.EmailService;
import com.auth.ums.services.MessageNotification.MessageNotificationService;
import com.auth.ums.services.RoleService.RoleService;
import com.auth.ums.services.UserRoleService.UserRoleService;
import com.auth.ums.utility.*;
import com.auth.ums.configs.ApiResponseCodes;
import com.auth.ums.configs.ÄpiMessageCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {


    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    EmailService emailService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleService roleService;
    @Autowired
    UserRoleService userRoleService;

    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    MessageNotificationService notificationService;



    @Override
    public ApiResponse<UserResponse> adduser(AddUserRequest request) {
        log.info("Add User request received: {}", JsonUtils.toJson(request));
        try {
            //   UserResponse response = new UserResponse();
            Optional<User> optionalEmail = userRepository.findByEmail(request.getEmail());

            if (optionalEmail != null && !optionalEmail.isEmpty()) {
                return ApiResponse.failure("Email is Already Used");
            }
            Optional<User> optionalPhoneNumber = userRepository.findByPhoneNumber(request.getPhoneNumber());
            if (optionalPhoneNumber != null && !optionalPhoneNumber.isEmpty()) {
                return ApiResponse.failure("PhoneNumber is Already Used");
            }

            Optional<User> loggedInUserInfo = userRepository.findByEmailAndIsActive(jwtUtil.getCurrentUsername(), true);

            User loggedInData = loggedInUserInfo.get();


            User user = UserMapper.addUser(request);
            user.setCreatedBy(jwtUtil.getCurrentUsername());
            user.setCreatedDate(LocalDateTime.now());

            if(loggedInData.getUserType().equals("ADMIN")){
                user.setUserType("ADMIN");
                user.setSystemCode("ADMIN_SYSTEM");
            } else if (loggedInData.getUserType().equals("COMPANY_ADMIN")) {
                user.setUserType("COMPANY_ADMIN");
                user.setSystemCode(loggedInData.getSystemCode());
            }

            user.setIsActive(true);
            user.setIsDeleted(false);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            //    response.setUser(UserMapper.toUserDTO(user));
            userRepository.save(user);
            log.info("User created successfully with id={}", user.getId());

            ///  add CUSTOMER Role to the user
            var roleResponse = roleService.getRoleByName("ADMIN");
            if (roleResponse != null && roleResponse.getCode().equals(ApiResponseCodes.SUCCESS)) {
                AddUserRoleRequest addRole = new AddUserRoleRequest();
                addRole.setRoleId(roleResponse.getData().getDto().getId());
                addRole.setUserId(user.getId());
                log.info("Assigning ADMIN role to userId={}", JsonUtils.toJson(roleResponse));
                userRoleService.addUserRole(addRole);
            }
            ///


            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTo(List.of(request.getEmail()));
            emailRequest.setSubject("Welcome! You Can Now Sign In");
            emailRequest.setHtml(EmailTemplates.accountCreatedSuccessfully(request.getEmail(),request.getPassword()));

            emailService.sendEmailAsync(emailRequest);

            notificationService.push(NotificationHelper.accountCreated(user.getEmail()));
            notificationService.push(NotificationHelper.newUserCreated(jwtUtil.getCurrentUsername(),request.getEmail()));

            return ApiResponse.success(null, "AddSuccessFully");
        } catch (Exception e) {
            log.error("Error while adding user:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<UserResponse> addCompanyUser(AddUserRequest request ,String companyCode) {
        log.info("Add User request received: {}", JsonUtils.toJson(request));
        try {
            //   UserResponse response = new UserResponse();
            Optional<User> optionalEmail = userRepository.findByEmail(request.getEmail());

            if (optionalEmail != null && !optionalEmail.isEmpty()) {
                return ApiResponse.failure("Email is Already Used");
            }
            Optional<User> optionalPhoneNumber = userRepository.findByPhoneNumber(request.getPhoneNumber());
            if (optionalPhoneNumber != null && !optionalPhoneNumber.isEmpty()) {
                return ApiResponse.failure("PhoneNumber is Already Used");
            }
            User user = UserMapper.addUser(request);
            user.setCreatedBy(request.getEmail());
            user.setCreatedDate(LocalDateTime.now());
            user.setUserType("COMPANY_ADMIN");
            user.setSystemCode(companyCode);
            user.setIsActive(true);
            user.setIsDeleted(false);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            //    response.setUser(UserMapper.toUserDTO(user));
            userRepository.save(user);
            log.info("User created successfully with id={}", user.getId());

            ///  add CUSTOMER Role to the user
            var roleResponse = roleService.getRoleByName("COMPANY_ADMIN");
            if (roleResponse != null && roleResponse.getCode().equals(ApiResponseCodes.SUCCESS)) {
                AddUserRoleRequest addRole = new AddUserRoleRequest();
                addRole.setRoleId(roleResponse.getData().getDto().getId());
                addRole.setUserId(user.getId());
                log.info("Assigning COMPANY_ADMIN role to userId={}", JsonUtils.toJson(roleResponse));
                userRoleService.addUserRole(addRole);
            }
            ///
            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTo(List.of(request.getEmail()));
            emailRequest.setSubject("Welcome! You Can Now Sign In");
            emailRequest.setHtml(EmailTemplates.accountCreatedSuccessfully(request.getEmail(),request.getPassword()));
            emailService.sendEmailAsync(emailRequest);
            String creator = jwtUtil.getCurrentUsername();
            notificationService.push(NotificationHelper.newUserCreated(creator != null ? creator : "SYSTEM", request.getEmail()));

            return ApiResponse.success(null, "AddSuccessFully");
        } catch (Exception e) {
            log.error("Error while adding user:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<UserResponse> signupCustomer(AddUserRequest request) {
        log.info("Add User request received: {}", JsonUtils.toJson(request));
        try {
            //   UserResponse response = new UserResponse();
            Optional<User> optionalEmail = userRepository.findByEmail(request.getEmail());

            if (optionalEmail != null && !optionalEmail.isEmpty()) {
                return ApiResponse.failure("Email is Already Used");
            }
            Optional<User> optionalPhoneNumber = userRepository.findByPhoneNumber(request.getPhoneNumber());
            if (optionalPhoneNumber != null && !optionalPhoneNumber.isEmpty()) {
                return ApiResponse.failure("PhoneNumber is Already Used");
            }
            User user = UserMapper.addUser(request);
            user.setCreatedBy(request.getEmail());
            user.setCreatedDate(LocalDateTime.now());
            user.setUserType("CUSTOMER");
            user.setSystemCode("CUSTOMER");
            user.setIsActive(true);
            user.setIsDeleted(false);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            //    response.setUser(UserMapper.toUserDTO(user));
            userRepository.save(user);
            log.info("User created successfully with id={}", user.getId());

            ///  add CUSTOMER Role to the user
            var roleResponse = roleService.getRoleByName("CUSTOMER");
            if (roleResponse != null && roleResponse.getCode().equals(ApiResponseCodes.SUCCESS)) {
                AddUserRoleRequest addRole = new AddUserRoleRequest();
                addRole.setRoleId(roleResponse.getData().getDto().getId());
                addRole.setUserId(user.getId());
                log.info("Assigning CUSTOMER role to userId={}", JsonUtils.toJson(roleResponse));
                userRoleService.addUserRole(addRole);
            }
            ///
            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTo(List.of(request.getEmail()));
            emailRequest.setSubject("Welcome! You Can Now Sign In");
            emailRequest.setHtml(EmailTemplates.accountCreatedSuccessfully(request.getEmail(),request.getPassword()));
            emailService.sendEmailAsync(emailRequest);

            notificationService.push(NotificationHelper.newUserCreated(jwtUtil.getCurrentUsername(),request.getEmail()));

            return ApiResponse.success(null, "AddSuccessFully");
        } catch (Exception e) {
            log.error("Error while adding user:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<UserResponse> login(LoginRequest request) {
        log.info("Login attempt for email={}", JsonUtils.toJson(request));
        {
            UserResponse response = new UserResponse();
            Optional<User> optional = userRepository.findByEmailAndIsActive(request.getEmail(), true);
            if (optional.isEmpty()) {
                return ApiResponse.failure("User not Found");
            }
            User user = optional.get();
            if (user.getIsDeleted()) {
                return ApiResponse.failure("User not found");
            }
            if (passwordEncoder.matches(request.getPassword(), optional.get().getPassword())) {
                response.setUser(UserMapper.toUserDTO(user));

                EmailRequest emailRequest = new EmailRequest();
                emailRequest.setTo(List.of(request.getEmail()));
                emailRequest.setSubject("Your Account Was Accessed Successfully");
                emailRequest.setHtml(EmailTemplates.loginSuccessful());
                emailService.sendEmailAsync(emailRequest);

                notificationService.push(NotificationHelper.lastLogin(request.getEmail()));

                return ApiResponse.success(response, "Fetch SuccessFully");
            } else {
                log.warn("Invalid password for email={}", JsonUtils.toJson(response));
                return ApiResponse.failure("User not Found");
            }
        }
    }

    @Override
    public ApiResponse<UserResponse> findByUserId(Long id) {
        log.info("Find user by id request received: userId={}", id);
        UserResponse response = new UserResponse();
        Optional<User> optional = userRepository.findById(id);
        if (optional.isEmpty()) {
            return ApiResponse.failure("User not Found");
        }
        User user = optional.get();
        if (user.getIsDeleted()) {
            return ApiResponse.failure("User not found");
        }
        response.setUser(UserMapper.toUserDTO(user));
        log.info("User fetched successfully, userId={}", id);
        return ApiResponse.success(response, "Fetch SuccessFully");
    }

    @Override
    public ApiResponse<UserResponse> changePasswordByLoggedInUser(String userName, ChangePasswordRequest request) {
        log.info("Change password request received for username={}", userName);

        UserResponse response = new UserResponse();
        Optional<User> optional = userRepository.findByEmailAndIsActive(userName, true);
        if (optional.isEmpty()) {
            return ApiResponse.failure("User not Found");
        }
        User user = optional.get();
        if (user.getIsDeleted()) {
            return ApiResponse.failure("User not found");
        }
        if (passwordEncoder.matches(request.getOldPassword(), optional.get().getPassword())) {

            /// set new password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setUpdatedBy(jwtUtil.getCurrentUsername());
            user.setUpdatedDate(LocalDateTime.now());
            userRepository.save(user);

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTo(List.of(user.getEmail()));
            emailRequest.setSubject("Your Account Password Has Been Successfully Updated");
            emailRequest.setHtml(EmailTemplates.passwordUpdatedSuccessfully());
            emailService.sendEmailAsync(emailRequest);


            response.setUser(UserMapper.toUserDTO(user));
            log.info("Password updated successfully, userId={}", user.getId());

            notificationService.push(NotificationHelper.passwordChanged(jwtUtil.getCurrentUsername()));
            return ApiResponse.success(response, "Password Updated Successfully");

        } else {
            return ApiResponse.failure("User not Found");
        }

    }

    @Override
    public ApiResponse<UserResponse> findByUserName(String userName) {
        log.info("Find user by username request received: username={}", userName);
        UserResponse response = new UserResponse();
        Optional<User> optional = userRepository.findByEmailAndIsActive(userName, true);
        if (optional.isEmpty()) {
            return ApiResponse.failure("User not Found");
        }
        User user = optional.get();
        if (user.getIsDeleted()) {
            return ApiResponse.failure("User not found");
        }
        response.setUser(UserMapper.toUserDTO(user));
        log.info("Fetched successfully, userId={}", JsonUtils.toJson(user));
        return ApiResponse.success(response, "Fetch SuccessFully");
    }

    @Override
    public ApiResponse<UserResponse> passwordChangeByToken(Long userId, PasswordChangeByToken request) {
        log.info("Password change by token request received: userId={}", userId);
        UserResponse response = new UserResponse();
        Optional<User> optional = userRepository.findById(userId);
        if (optional.isEmpty()) {
            return ApiResponse.failure("User not Found");
        }
        User user = optional.get();
        if (user.getIsDeleted()) {
            return ApiResponse.failure("User not found");
        }
        /// set new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedBy(jwtUtil.getCurrentUsername());
        user.setUpdatedDate(LocalDateTime.now());
        userRepository.save(user);

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(List.of(user.getEmail()));
        emailRequest.setSubject("Your Account Password Has Been Successfully Updated");
        emailRequest.setHtml(EmailTemplates.passwordUpdatedSuccessfully());
        emailService.sendEmailAsync(emailRequest);

        response.setUser(UserMapper.toUserDTO(user));
        log.info("Password updated by token successfully:{}", JsonUtils.toJson(user));

        notificationService.push(NotificationHelper.passwordChanged(request.getContact()));

        return ApiResponse.success(response, "Password Updated Successfully");
    }


    @Override
    public ApiResponse<UserResponse> getAllUser() {
        log.info("Get all users request received");
        UserResponse response = new UserResponse();
        try {
            Optional<User> loggedInUserInfo = userRepository.findByEmailAndIsActive(jwtUtil.getCurrentUsername(), true);
            User loggedInData = loggedInUserInfo.get();

            List<User> users = userRepository.findAllByIsDeletedFalse();

            if (users.isEmpty()) {
                return ApiResponse.failure("No User List");
            }

            if (loggedInData.getUserType().equals("ADMIN")) {
                response.setUsers(
                        users.stream()
                                .map(UserMapper::toUserDTO)
                                .toList()
                );

            } else if (loggedInData.getUserType().equals("COMPANY_ADMIN")) {

                List<User> companyUsers = users.stream()
                        .filter(user -> user.getSystemCode().equals(loggedInData.getSystemCode()))
                        .toList();

                if (companyUsers.isEmpty()) {
                    return ApiResponse.failure("No User List Found For This Company");
                }

                response.setUsers(
                        companyUsers.stream()
                                .map(UserMapper::toUserDTO)
                                .toList()
                );
            }
            log.info("Total users fetched: {}", users.size());
            return ApiResponse.success(response, "Fetch successfully");

        } catch (Exception e) {
            log.error("Error while fetching users:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<UserResponse> updateUser(UpdateUserRequest request) {
        log.info("Update User request received: {}", JsonUtils.toJson(request));
        UserResponse response = new UserResponse();
        try {
            Optional<User> optional = userRepository.findById(request.getId());
            if (optional.isEmpty()) {
                return ApiResponse.failure("User not Found");
            }
            if (optional.get().getIsDeleted()) {
                return ApiResponse.failure("User not Found");
            }
            User user = optional.get();
            user = UserMapper.updateUser(user, request);
            user.setIsActive(Boolean.TRUE);
            user.setUpdatedDate(LocalDateTime.now());
            user.setUpdatedBy(jwtUtil.getCurrentUsername());
            userRepository.save(user);
            response.setUser(UserMapper.toUserDTO(user));
            log.info("User updated successfully:{}", JsonUtils.toJson(user));

            notificationService.push(NotificationHelper.profileUpdated(user.getEmail()));

            return ApiResponse.success(response, "Update SuccessFully");
        } catch (Exception e) {
            log.error("Error while updating user:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }

    }

    @Override
    public ApiResponse<UserResponse> deleteUser(DeleteUserRequest request) {
        log.info("Delete User request received: {}", JsonUtils.toJson(request));
        UserResponse response = new UserResponse();
        try {
            Optional<User> optional = userRepository.findById(request.getId());
            if (optional.isEmpty()) {
                return ApiResponse.failure("User not Found");
            }
            if (optional.get().getIsDeleted()) {
                return ApiResponse.failure("User not Found");
            }
            User user = optional.get();
            user = UserMapper.deleteUser(user, request);
            user.setIsActive(Boolean.FALSE);
            user.setIsDeleted(true);
            user.setUpdatedDate(LocalDateTime.now());
            user.setUpdatedBy(jwtUtil.getCurrentUsername());
            userRepository.save(user);
            response.setUser(UserMapper.toUserDTO(user));
            log.info("User deleted successfully{}", JsonUtils.toJson(user));
            notificationService.push(NotificationHelper.genericDeleted(jwtUtil.getCurrentUsername(),user.getEmail()));

            return ApiResponse.success(response, "Delete SuccessFully");
        } catch (Exception e) {
            log.error("Error while deleting user:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }


    // massage code na vako vayer only sucess message pathako vaye...!
    @Override
    public PageResponse<UserResponseDto> searchUsers(String keyword, int page, int size, String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        Specification<User> spec = UserSpecification.searchByKeyword(keyword);

        Page<User> userPage = userRepository.findAll(spec, pageable);

        List<UserResponseDto> users = userPage.getContent()
                .stream()
                .map(u -> new UserResponseDto(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getAge(),
                        u.getPhoneNumber()
                ))
                .toList();

        return new PageResponse<>(
                users,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }


    @Override
    public ApiResponse<PageResponse<UserDto>> searchUsersNew(String keyword, int page, int size, String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        // search data in the page
        Specification<User> spec = UserSpecification.searchByKeyword(keyword);

        Page<User> userPage = userRepository.findAll(spec, pageable);

        List<UserDto> users = userPage.stream()
                .map(UserMapper::toUserDTO)
                .toList();
        if (users.size() > 0) {
            return ApiResponse.success(new PageResponse<>(
                    users,
                    userPage.getNumber(),
                    userPage.getSize(),
                    userPage.getTotalElements(),
                    userPage.getTotalPages(),
                    userPage.isLast()
            ), ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());
        } else {
            return ApiResponse.nodatafound(new PageResponse<>(
                    users,
                    userPage.getNumber(),
                    userPage.getSize(),
                    userPage.getTotalElements(),
                    userPage.getTotalPages(),
                    userPage.isLast()
            ), ÄpiMessageCodes.NO_RESULT_FOUND.toString());
        }
    }
    @Override
    public ApiResponse<UserResponse> getRecentUsers() {

        log.info("Get recent users request received");

        UserResponse response = new UserResponse();

        try {
            List<User> users = userRepository.findTop10RecentUsers();

            if (users.isEmpty()) {
                return ApiResponse.failure("No Recent Users Found");
            }

            response.setUsers(
                    users.stream()
                            .map(UserMapper::toUserDTO)
                            .toList()
            );

            return ApiResponse.success(
                    response,
                    "Recent users fetched successfully"
            );

        } catch (Exception e) {

            log.error("Error while fetching recent users: {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }
    @Override
    public ApiResponse<UserCountResponse> getUserCount() {

        log.info("Get user count request received");

        UserCountResponse response = new UserCountResponse();

        try {

            UserCountProjection result = userRepository.getUserCounts();

            response.setTotalUsers(result.getTotalUsers());
            response.setTotalCustomers(result.getTotalCustomers());
            response.setTotalCompanyAdmins(result.getTotalCompanyAdmins());


            return ApiResponse.success(
                    response,
                    "User count fetched successfully"
            );

        } catch (Exception e) {

            log.error("Error while fetching user count : {}", e.getMessage(), e);

            return ApiResponse.exception(e.getMessage());
        }
    }



}