package com.auth.ums.controller;


import com.auth.ums.requestmodels.RoleRequestModel.AddRoleRequest;
import com.auth.ums.requestmodels.RoleRequestModel.DeleteRoleRequest;
import com.auth.ums.requestmodels.RoleRequestModel.UpdateRoleRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Role.RoleResponse;
import com.auth.ums.services.RoleService.RoleService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1/role")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping("/add")
    ResponseEntity<ApiResponse<RoleResponse>> addRole(@Valid @RequestBody AddRoleRequest request){
        return ResponseEntity.ok(roleService.addRole(request));
    }
    @PutMapping("/update")
    ResponseEntity<ApiResponse<RoleResponse>> updateRole(@Valid @RequestBody UpdateRoleRequest request){
        return ResponseEntity.ok(roleService.updateRole(request));
    }
    @GetMapping("/get-by-id/{id}")
    ResponseEntity<ApiResponse<RoleResponse>> getRoleBYId(@Validated Long id){
        return ResponseEntity.ok(roleService.getRoleById(id));
    }
    @GetMapping("/get-all")
    ResponseEntity<ApiResponse<RoleResponse>> getAllRole(){
        return ResponseEntity.ok(roleService.getAllRoll());
    }
    @DeleteMapping("/delete")
    ResponseEntity<ApiResponse<RoleResponse>> deleteRollById(@Valid @RequestBody DeleteRoleRequest request){
        return ResponseEntity.ok(roleService.deleteRole(request));
    }
    @GetMapping("/get-by-name")
    ResponseEntity<ApiResponse<RoleResponse>> getRollByName(@Validated String name){
        return ResponseEntity.ok(roleService.getRoleByName(name));
    }
}
