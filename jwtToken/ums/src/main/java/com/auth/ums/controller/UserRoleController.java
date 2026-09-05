package com.auth.ums.controller;

import com.auth.ums.requestmodels.UserRoleRequestModel.AddUserRoleRequest;
import com.auth.ums.requestmodels.UserRoleRequestModel.DeleteUserRoleRequest;
import com.auth.ums.requestmodels.UserRoleRequestModel.UpdateUserRoleRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.UserRole.UserRoleResponse;
import com.auth.ums.services.UserRoleService.UserRoleService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1/user-role")
public class UserRoleController {
    @Autowired
    private UserRoleService userRoleService;
    @PostMapping("add-user-role")
    ResponseEntity<ApiResponse<UserRoleResponse>> addUserRole(@Valid @RequestBody AddUserRoleRequest request){
        return ResponseEntity.ok(userRoleService.addUserRole(request));
    }

    @PutMapping("update-user-role")
    ResponseEntity<ApiResponse<UserRoleResponse>> updateUserRole(@Valid @RequestBody UpdateUserRoleRequest request){
        return ResponseEntity.ok(userRoleService.updateUserRole(request));
    }

    @DeleteMapping("delete-user-role")
    ResponseEntity<ApiResponse<UserRoleResponse>> deleteUserRole(@Valid @RequestBody DeleteUserRoleRequest request){
        return ResponseEntity.ok(userRoleService.deleteUserRole(request));
    }

    @GetMapping("get-all-user-role")
    ResponseEntity<ApiResponse<UserRoleResponse>> getAllUserRole(){
        return ResponseEntity.ok(userRoleService.getAllUserRole());
    }

}


