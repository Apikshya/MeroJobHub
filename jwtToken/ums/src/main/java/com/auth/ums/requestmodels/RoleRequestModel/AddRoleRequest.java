package com.auth.ums.requestmodels.RoleRequestModel;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddRoleRequest {

    @NotBlank(message = "Name is Required ")
    private String name;

//    @NotBlank(message = "CreatedDate is Required ")
//    private LocalDateTime CreatedDate;
//
//    @NotBlank(message = "CreatedBy is Required ")
//    private String createdBy;
//
//    @NotBlank(message = "IsActive is Required ")
//    private Boolean isActive;
//
//    @NotBlank(message = "Remarks is Required ")
//    private String remarks;


}
