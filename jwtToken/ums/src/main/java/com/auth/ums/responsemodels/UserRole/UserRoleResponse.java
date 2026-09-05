package com.auth.ums.responsemodels.UserRole;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
@Data
public class UserRoleResponse {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("dto")
    private UserRoleDTO dto;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("dtos")
    private List<UserRoleDTO> dtos;
}
