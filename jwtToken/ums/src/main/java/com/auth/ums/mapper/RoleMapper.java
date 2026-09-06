package com.auth.ums.mapper;
import com.auth.ums.models.Role;
import com.auth.ums.requestmodels.RoleRequestModel.AddRoleRequest;
import com.auth.ums.requestmodels.RoleRequestModel.DeleteRoleRequest;
import com.auth.ums.requestmodels.RoleRequestModel.UpdateRoleRequest;
import com.auth.ums.responsemodels.Role.RoleDTO;


import java.util.List;
import java.util.stream.Collectors;

public class RoleMapper {

    public static Role addRole(AddRoleRequest request) {
        if (request == null) {
            return null;
        }
        Role entity = new Role();
        entity.setName(request.getName());
        return entity;
    }


    public static Role updateRole(Role role,UpdateRoleRequest request) {
        if (request == null) {
            return null;
        }
        role.setName(request.getName());
        return role;
    }


    public static Role deleteRole(Role role, DeleteRoleRequest request) {
        if (request == null) {
            return null;
        }
        role.setRemarks(request.getRemarks());
        return role;
    }







    /* ================= Entity → DTO ================= */

    public static RoleDTO toDto(Role role) {
        if (role == null) {
            return null;
        }

        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setName(role.getName());

        // BaseEntity → BaseDTO fields
      //  dto.setCreatedDate(role.getCreatedDate());
        dto.setCreatedBy(role.getCreatedBy());
      //  dto.setUpdatedDate(role.getUpdatedDate());
        dto.setUpdatedBy(role.getUpdatedBy());
      //  dto.setIsActive(role.getIsActive());
        dto.setRemarks(role.getRemarks());

        return dto;
    }

    public static List<RoleDTO> toDTOList(List<Role> roles) {
        if (roles == null) {
            return List.of(); // safer than null
        }

        return roles.stream()
                .map(RoleMapper::toDto) // ✅ correct static reference
                .collect(Collectors.toList());
    }
}
