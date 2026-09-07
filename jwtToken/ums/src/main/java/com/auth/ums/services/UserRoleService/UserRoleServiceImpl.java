package com.auth.ums.services.UserRoleService;

import com.auth.ums.mapper.UserRoleMapper;
import com.auth.ums.models.Role;
import com.auth.ums.models.User;
import com.auth.ums.models.UserRole;
import com.auth.ums.repository.RoleRepository;
import com.auth.ums.repository.UserRepository;
import com.auth.ums.repository.UserRoleRepository;
import com.auth.ums.requestmodels.UserRoleRequestModel.AddUserRoleRequest;
import com.auth.ums.requestmodels.UserRoleRequestModel.DeleteUserRoleRequest;
import com.auth.ums.requestmodels.UserRoleRequestModel.UpdateUserRoleRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.UserRole.UserRoleResponse;
import com.auth.ums.utility.JsonUtils;
import com.auth.ums.utility.Utility;
import com.auth.ums.configs.ÄpiMessageCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserRoleServiceImpl implements UserRoleService {
    private static final Logger log = LoggerFactory.getLogger(UserRoleServiceImpl.class);
    @Autowired
    UserRoleRepository userRoleRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;

    @Override
    public ApiResponse<UserRoleResponse> addUserRole(AddUserRoleRequest request) {
        log.info("Add UserRole request received: {}", JsonUtils.toJson(request));

        UserRoleResponse response = new UserRoleResponse();
        try {
            Optional<User> optionalUserId = userRepository.findById(request.getUserId());
            if (optionalUserId.isEmpty()) {
                return ApiResponse.failure("User id Not found ");
            }

            Optional<Role> optionalRoleId = roleRepository.findById(request.getRoleId());
            if (optionalRoleId.isEmpty()) {
                return ApiResponse.failure("Role id Not found ");
            }

            UserRole entity = new UserRole();
            entity = UserRoleMapper.addUserRole(request);
            entity.setCreatedBy(Utility.getDefaultUsername());
            entity.setCreatedDate(LocalDateTime.now());
            entity.setIsActive(true);
            entity.setIsDeleted(false);
            userRoleRepository.save(entity);
            log.info("UserRole created successfully with id={}", JsonUtils.toJson(entity));
            response.setDto(UserRoleMapper.toDto(entity));
            return ApiResponse.success(response, ÄpiMessageCodes.CREATED_SUCCESSFULLY.toString());

        } catch (Exception e) {
            log.error("Error while adding UserRole:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<UserRoleResponse> updateUserRole(UpdateUserRoleRequest request) {
        log.info("Update UserRole request received: userRoleId={}", JsonUtils.toJson(request));
        UserRoleResponse response = new UserRoleResponse();
        try {
            Optional<UserRole> optional = userRoleRepository.findById(request.getUserId());
            if (optional.isEmpty()) {
                return ApiResponse.failure("UserRole id Not found ");
            }

            Optional<User> optionalUserId = userRepository.findById(request.getUserId());
            if (optionalUserId.isEmpty()) {
                return ApiResponse.failure("User id Not found ");
            }
            Optional<Role> optionalRoleId = roleRepository.findById(request.getRoleId());
            if (optionalRoleId.isEmpty()) {
                return ApiResponse.failure("Role id Not found ");
            }
            Optional<UserRole> optionalid = userRoleRepository.findById(request.getId());
            if (optionalid.get().getIsDeleted()) {
                return ApiResponse.failure("UserRole id is not found");
            }
            UserRole entity = optional.get();
            entity = UserRoleMapper.updateUserRole(entity, request);
            entity.setUpdatedBy(Utility.getDefaultUsername());
            entity.setUpdatedDate(LocalDateTime.now());
            userRoleRepository.save(entity);
            response.setDto(UserRoleMapper.toDto(entity));
            log.info("UserRole updated successfully with id={}", JsonUtils.toJson(entity));
            return ApiResponse.success(response, ÄpiMessageCodes.UPDATED_SUCCESSFULLY.toString());
        } catch (Exception e) {
            log.error("Error while updating UserRole :{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<UserRoleResponse> deleteUserRole(DeleteUserRoleRequest request) {
        log.info("Delete UserRole request received: userRoleId={}", request.getId());
        UserRoleResponse response = new UserRoleResponse();
        try {
            // check if role name already exists or not
            Optional<UserRole> optional = userRoleRepository.findById(request.getId());
            if (optional.isEmpty()) {
                return ApiResponse.failure("UserRole id is not found");
            }
            UserRole entity = optional.get();
            entity = UserRoleMapper.deleteUserRole(entity, request);
            entity.setUpdatedBy(Utility.getDefaultUsername());
            entity.setUpdatedDate(LocalDateTime.now());
            entity.setIsActive(false);
            entity.setIsDeleted(true);
            userRoleRepository.save(entity);
            response.setDto(UserRoleMapper.toDto(entity));
            log.info("UserRole deleted successfully:{}", JsonUtils.toJson(entity));
            return ApiResponse.success(response, ÄpiMessageCodes.DELETED_SUCCESSFULLY.toString());
        } catch (Exception e) {
            log.error("Error while deleting UserRole :{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<UserRoleResponse> getAllUserRole() {
        log.info("Fetch all UserRoles request received");

        UserRoleResponse response = new UserRoleResponse();
        try {
            List<UserRole> userRoles = userRoleRepository.findAll();
            if (userRoles.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }
            response.setDtos(UserRoleMapper.toDTOList(userRoles));
            log.info("Total UserRoles fetched: {}", userRoles.size());
            return ApiResponse.success(response, ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());

        } catch (Exception e) {
            log.error("Error while fetching UserRoles:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

}

