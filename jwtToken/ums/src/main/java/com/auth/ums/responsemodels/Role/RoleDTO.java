package com.auth.ums.responsemodels.Role;

import com.auth.ums.responsemodels.BaseDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoleDTO extends BaseDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;

}
