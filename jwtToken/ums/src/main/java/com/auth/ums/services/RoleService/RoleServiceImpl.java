package com.auth.ums.services.RoleService;

import com.auth.ums.mapper.RoleMapper;
import com.auth.ums.models.Role;
import com.auth.ums.repository.RoleRepository;
import com.auth.ums.requestmodels.RoleRequestModel.AddRoleRequest;
import com.auth.ums.requestmodels.RoleRequestModel.DeleteRoleRequest;
import com.auth.ums.requestmodels.RoleRequestModel.UpdateRoleRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Role.RoleResponse;
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
public class RoleServiceImpl implements RoleService {
    private static final Logger log = LoggerFactory.getLogger(RoleServiceImpl.class);
    @Autowired
    RoleRepository roleRepository;

    @Override
    public ApiResponse<RoleResponse> addRole(AddRoleRequest request) {
        log.info("Request received to add role with name: {}", JsonUtils.toJson(request));

        RoleResponse response = new RoleResponse();

        try {
            // check if role name already exists or not
            Optional<Role> optional = roleRepository.findByName(request.getName());
            if (optional.isPresent()) {
                log.warn("Role name already exists: {}", request.getName());
                return ApiResponse.failure("UserName is Already Used");
            }
            Role entity = new Role();
            entity = RoleMapper.addRole(request);
            entity.setCreatedBy(Utility.getDefaultUsername());
            entity.setCreatedDate(LocalDateTime.now());
            entity.setIsActive(true);
            entity.setIsDeleted(false);
            roleRepository.save(entity);
            response.setDto(RoleMapper.toDto(entity));
            log.info("Role created successfully with id: {}", JsonUtils.toJson(entity));
            return ApiResponse.success(response, ÄpiMessageCodes.CREATED_SUCCESSFULLY.toString());
        } catch (Exception e) {
            log.error("Error occurred while adding role:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }

    }

    @Override
    public ApiResponse<RoleResponse> updateRole(UpdateRoleRequest request) {
        log.info("Request received to update role with id: {}", JsonUtils.toJson(request));
        RoleResponse response = new RoleResponse();
        try {
            // check if role name already exists or not
            Optional<Role> optional = roleRepository.findByName(request.getName());
            if (optional.isPresent()) {
                //check the id is duplicate or not
                if (!optional.get().getId().equals(request.getId())) {
                    log.warn("Duplicate role name found: {}", request.getName());
                    return ApiResponse.failure(ÄpiMessageCodes.DUPLICATE_DATA_FOUND.toString());
                }
            }
            Optional<Role> model = roleRepository.findById(request.getId());
            if (model == null || model.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }
            if (model.get().getIsDeleted()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }
            Role entity = model.get();
            entity = RoleMapper.updateRole(entity, request);
            entity.setUpdatedBy(Utility.getDefaultUsername());
            entity.setUpdatedDate(LocalDateTime.now());
            roleRepository.save(entity);
            log.info("Role updated successfully with id: {}", JsonUtils.toJson(entity));
            response.setDto(RoleMapper.toDto(entity));
            return ApiResponse.success(response, ÄpiMessageCodes.UPDATED_SUCCESSFULLY.toString());
        } catch (Exception e) {
            log.error("Error occurred while updating role with id: {}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }

    }

    @Override
    public ApiResponse<RoleResponse> getRoleById(Long id) {
        log.info("Fetching role by id: {}", id);
        RoleResponse response = new RoleResponse();
        try {
            Optional<Role> optional = roleRepository.findById(id);
            if (optional.isEmpty()) {
                return ApiResponse.failure("Role Id is not Found");
            }
            if (optional.get().getIsDeleted() == true) {
                return ApiResponse.failure("Role Id is not Found");
            }
            Role entity = optional.get();
            response.setDto(RoleMapper.toDto(entity));
            log.info("Role fetched successfully for id: {}", JsonUtils.toJson(entity));
            return ApiResponse.success(response, ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());
        } catch (Exception e) {
            log.error("Error occurred while fetching role by id: {}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<RoleResponse> getAllRoll() {
        log.info("Fetching all roles");
        RoleResponse response = new RoleResponse();
        try {
            List<Role> roles = roleRepository.findAll();

            if (roles.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }
            response.setDtos(RoleMapper.toDTOList(roles));
            log.info("Fetched {} roles", JsonUtils.toJson(response));
            return ApiResponse.success(response, ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());
        } catch (Exception e) {
            log.error("Error occurred while fetching all roles:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<RoleResponse> deleteRole(DeleteRoleRequest request) {
        log.info("Request received to delete role with id: {}", JsonUtils.toJson(request));

        RoleResponse response = new RoleResponse();
        try {
            // check if role name already exists or not
            Optional<Role> optional = roleRepository.findById(request.getId());
            if (optional.isEmpty()) {
                return ApiResponse.failure("Role id is not found");
            }
            Role entity = optional.get();
            entity = RoleMapper.deleteRole(entity, request);
            entity.setUpdatedBy(Utility.getDefaultUsername());
            entity.setUpdatedDate(LocalDateTime.now());
            entity.setIsActive(false);
            entity.setIsDeleted(true);
            roleRepository.save(entity);
            log.info("Role deleted successfully with id: {}", JsonUtils.toJson(entity));
            response.setDto(RoleMapper.toDto(entity));
            return ApiResponse.success(response, ÄpiMessageCodes.DELETED_SUCCESSFULLY.toString());
        } catch (Exception e) {
            log.error("Error occurred while deleting role with id: {}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<RoleResponse> getRoleByName(String name) {
        log.info("Fetching role by name: {}", name);
        RoleResponse response = new RoleResponse();
        try {
            Optional<Role> optional = roleRepository.findByName(name);
            if (optional.isEmpty()) {
                return ApiResponse.failure("Role Id is not Found");
            }
            if (optional.get().getIsDeleted() == true) {
                return ApiResponse.failure("Role Id is not Found");
            }
            Role entity = optional.get();
            response.setDto(RoleMapper.toDto(entity));
            log.info("Role fetched successfully for name: {}", name);
            return ApiResponse.success(response, ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());
        } catch (Exception e) {
            log.error("Error occurred while fetching role by name: {}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<RoleResponse> geUserRoleByUserId(Long userId) {
        log.info("Fetching roles for userId: {}", userId);
        RoleResponse response = new RoleResponse();
        try {
            List<Role> roles = roleRepository.geUserRoleByUserId(userId);
            if (roles.isEmpty()) {
                return ApiResponse.failure(ÄpiMessageCodes.NO_RESULT_FOUND.toString());
            }
            response.setDtos(RoleMapper.toDTOList(roles));
            log.info("Fetched {} roles for userId: {}", roles.size(), userId);
            return ApiResponse.success(response, ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());
        } catch (Exception e) {
            log.error("Error occurred while fetching roles for userId: {}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }
}