package com.auth.ums.requestmodels.Company;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteCompanyRequest {
    private Long id;

    @NotBlank(message = "Remarks is Required ")
    private String remarks;
}
