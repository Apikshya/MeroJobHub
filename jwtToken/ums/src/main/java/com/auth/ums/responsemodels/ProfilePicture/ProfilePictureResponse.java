package com.auth.ums.responsemodels.ProfilePicture;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProfilePictureResponse {

    @JsonProperty("message")
    private String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("profile_picture")
    private ProfilePictureDTO profilePicture;
}
