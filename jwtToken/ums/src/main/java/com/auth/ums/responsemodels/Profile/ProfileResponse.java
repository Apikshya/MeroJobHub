package com.auth.ums.responsemodels.Profile;

import com.auth.ums.responsemodels.user.UserDto;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProfileResponse {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("my_profile")
    private UserDto myProfile;
}
