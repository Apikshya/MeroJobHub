package com.auth.ums.responsemodels.job;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class JobResponse {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("job")
    private JobDTO job;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("jobs")
    private List<JobDTO> jobs;


}
