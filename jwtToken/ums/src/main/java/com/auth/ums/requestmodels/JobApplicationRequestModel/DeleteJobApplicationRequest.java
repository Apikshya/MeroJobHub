package com.auth.ums.requestmodels.JobApplicationRequestModel;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeleteJobApplicationRequest {

    @NotNull(message = "Application Id is Required")
    @JsonProperty("application_Id")
    private Long id;

    @NotBlank(message = "Remarks is Required")
    @JsonProperty("remarks")
    private String remarks;
}