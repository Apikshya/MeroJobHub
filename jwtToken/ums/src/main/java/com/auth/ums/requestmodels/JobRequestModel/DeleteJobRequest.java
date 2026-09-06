package com.auth.ums.requestmodels.JobRequestModel;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteJobRequest {
    private Long id;

    @NotBlank(message = "remarks is Required ")
    @JsonProperty("remarks")
    private String remarks;
}
