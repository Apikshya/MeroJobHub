package com.auth.ums.responsemodels.RefreshToken;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
@Data
public class RefreshTokenResponse {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("dto")
    private RefreshTokenDTO dto;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("dtos")
    private List<RefreshTokenDTO> dtos;

}
