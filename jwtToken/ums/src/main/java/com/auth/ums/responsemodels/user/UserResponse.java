package com.auth.ums.responsemodels.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
@Data
public class UserResponse {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("user")
    private UserDto user;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("users")
    private List<UserDto> users;

}
