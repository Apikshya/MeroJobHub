package com.auth.ums.responsemodels.Profile;

import com.auth.ums.responsemodels.BaseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProfileDTO extends BaseDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("new_Password")
    private String new_Password;

    @JsonProperty("conform_Password")
    private String conform_Password;

    @JsonProperty("old_Password")
    private String old_Password;

}
