package com.auth.ums.services.Company;
import com.auth.ums.requestmodels.Company.AddCompanyRequest;
import com.auth.ums.requestmodels.Company.DeleteCompanyRequest;
import com.auth.ums.requestmodels.Company.UpdateCompanyRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Company.CompanyResponse;



public interface CompanyService {
    ApiResponse<CompanyResponse> registerCompany(AddCompanyRequest requestDTO);
    ApiResponse<CompanyResponse> updateCompany(UpdateCompanyRequest requestDTO);
    ApiResponse<CompanyResponse> getCompanyByCode(String companyCode);
    ApiResponse<CompanyResponse> getMyCompany();
    ApiResponse<CompanyResponse> getAllCompanies();
    ApiResponse<CompanyResponse> getCompanyById(Long id);
    ApiResponse<CompanyResponse> deleteCompany(DeleteCompanyRequest request);

}
