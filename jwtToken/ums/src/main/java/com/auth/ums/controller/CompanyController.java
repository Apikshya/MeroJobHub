package com.auth.ums.controller;

import com.auth.ums.requestmodels.Company.AddCompanyRequest;
import com.auth.ums.requestmodels.Company.DeleteCompanyRequest;
import com.auth.ums.requestmodels.Company.UpdateCompanyRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Company.CompanyResponse;
import com.auth.ums.services.Company.CompanyService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1/company")
public class CompanyController {
    @Autowired
    private CompanyService companyService;


    /**
     * Register new company
     */
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CompanyResponse>> addCompany(
            @Valid @RequestBody AddCompanyRequest request) {

        return ResponseEntity.ok(companyService.registerCompany(request));
    }


    /**
     * Update existing company
     */
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateCompany(
            @Valid @RequestBody UpdateCompanyRequest request) {

        return ResponseEntity.ok(companyService.updateCompany(request));
    }


    /**
     * Get company by company code
     */
    @GetMapping("/code/{companyCode}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyByCode(
            @PathVariable String companyCode) {

        return ResponseEntity.ok(companyService.getCompanyByCode(companyCode));
    }


    /**
     * Get all companies
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<CompanyResponse>> getAllCompanies() {

        return ResponseEntity.ok(companyService.getAllCompanies());
    }


    /**
     * Get company by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(
            @PathVariable Long id) {

        return ResponseEntity.ok(companyService.getCompanyById(id));
    }


    /**
     * Delete company
     */
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<CompanyResponse>> deleteCompany(
            @Valid @RequestBody DeleteCompanyRequest request) {

        return ResponseEntity.ok(companyService.deleteCompany(request));
    }
}
