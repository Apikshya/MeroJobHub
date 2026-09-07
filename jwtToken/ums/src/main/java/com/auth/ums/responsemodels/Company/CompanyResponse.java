package com.auth.ums.responsemodels.Company;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyResponse {

    @JsonProperty("dto")
    private CompanyDTO company;

    @JsonProperty("dtos")
    private List<CompanyDTO> companies;
}
