package com.auth.ums.mapper;

import com.auth.ums.models.PasswordReset;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.AddPasswordResetRequest;
import com.auth.ums.responsemodels.PasswordReset.PasswordResetDTO;


public class PasswordResetMapper {
    public static PasswordReset addPasswordReset(AddPasswordResetRequest request) {
        if (request == null) {
            return null;
        }
        PasswordReset entity = new PasswordReset();
        entity.setUserId(request.getUserId());
        entity.setToken(request.getToken());
        entity.setTokenExpirationTime(request.getTokenExpirationTime());
        entity.setRequestIpAddress(request.getRequestIpAddress());
        entity.setResetTime(request.getResetTime());
        entity.setResetIpAddress(request.getResetIpAddress());
        entity.setResetMethod(request.getResetMethod());
        entity.setResetSource(request.getResetSource());
        entity.setAdditionalInfo(request.getAdditionalInfo());
        return entity;
    }

    // Entity → DTO
    public static PasswordResetDTO toDTO(PasswordReset request) {

        if (request == null) {
            return null;
        }
        PasswordResetDTO dto = new PasswordResetDTO();
        dto.setTokenExpirationTime(request.getTokenExpirationTime());
        //dto.setToken(request.getToken());
        dto.setUserId(request.getUserId());
        return dto;
    }


}

///* ================= Entity → DTO ================= */
//
//public static RoleDTO toDto(Role role) {
//    if (role == null) {
//        return null;
//    }
//
//    RoleDTO dto = new RoleDTO();
//    dto.setId(role.getId());
//    dto.setName(role.getName());
//
//    // BaseEntity → BaseDTO fields
//    //  dto.setCreatedDate(role.getCreatedDate());
//    dto.setCreatedBy(role.getCreatedBy());
//    //  dto.setUpdatedDate(role.getUpdatedDate());
//    dto.setUpdatedBy(role.getUpdatedBy());
//    //  dto.setIsActive(role.getIsActive());
//    dto.setRemarks(role.getRemarks());
//
//    return dto;
//}