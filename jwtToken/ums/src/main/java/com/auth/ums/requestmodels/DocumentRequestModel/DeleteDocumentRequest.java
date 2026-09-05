package com.auth.ums.requestmodels.DocumentRequestModel;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteDocumentRequest {
    @NotBlank(message = "Id is Required")
    private Long id;

    @NotBlank(message = "Remarks is Required")
    private String remarks;
}
