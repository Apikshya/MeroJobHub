package com.auth.ums.mapper;


import com.auth.ums.models.UserRole;
import com.auth.ums.requestmodels.UserRoleRequestModel.AddUserRoleRequest;
import com.auth.ums.requestmodels.UserRoleRequestModel.DeleteUserRoleRequest;
import com.auth.ums.requestmodels.UserRoleRequestModel.UpdateUserRoleRequest;
import com.auth.ums.responsemodels.UserRole.UserRoleDTO;

import java.util.List;
import java.util.stream.Collectors;

public class UserRoleMapper {

    public static UserRole addUserRole(AddUserRoleRequest request) {
        if (request == null) {
            return null;
        }
        UserRole entity = new UserRole();
        entity.setUserId(request.getUserId());
        entity.setRoleId(request.getRoleId());
        return entity;
    }
    public static UserRole updateUserRole( UserRole userRole,UpdateUserRoleRequest request) {
        if (request == null) {
            return null;
        }
        userRole.setUserId(request.getUserId());
        userRole.setRoleId(request.getRoleId());
        return userRole;
    }

    public static UserRole deleteUserRole(UserRole userRole, DeleteUserRoleRequest request) {
        if (request == null) {
            return null;
        }
        userRole.setRemarks(request.getRemarks());
        return userRole;
    }



    public static UserRoleDTO toDto(UserRole userRole) {
        if (userRole == null) {
            return null;
        }
        UserRoleDTO dto = new UserRoleDTO();
        dto.setId(userRole.getId());
        dto.setUserId(userRole.getUserId());
        dto.setRoleId(userRole.getRoleId());


        dto.setCreatedBy(userRole.getCreatedBy());
        dto.setUpdatedBy(userRole.getUpdatedBy());
        dto.setRemarks(userRole.getRemarks());
        return dto;
    }

    public static List<UserRoleDTO> toDTOList(List<UserRole> userRoles) {
        if (userRoles == null) {
            return List.of(); // safer than null
        }

        return userRoles.stream()
                .map(UserRoleMapper::toDto)
                .collect(Collectors.toList());
    }
}

