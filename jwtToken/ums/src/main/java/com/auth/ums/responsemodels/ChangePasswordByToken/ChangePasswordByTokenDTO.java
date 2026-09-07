package com.auth.ums.responsemodels.ChangePasswordByToken;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ChangePasswordByTokenDTO {

    @JsonProperty("new_Password")
    private String new_Password;

    @JsonProperty("conform_Password")
    private String conform_Password;

    @JsonProperty("Token")
    private String token;

}
