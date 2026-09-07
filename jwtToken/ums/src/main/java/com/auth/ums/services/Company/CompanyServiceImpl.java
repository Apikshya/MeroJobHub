package com.auth.ums.services.Company;

import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.mapper.CompanyMapper;
import com.auth.ums.models.Company;
import com.auth.ums.models.User;
import com.auth.ums.repository.CompanyRepository;
import com.auth.ums.repository.UserRepository;
import com.auth.ums.requestmodels.Auth.AddUserRequest;
import com.auth.ums.requestmodels.Company.AddCompanyRequest;
import com.auth.ums.requestmodels.Company.DeleteCompanyRequest;
import com.auth.ums.requestmodels.Company.UpdateCompanyRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Company.CompanyResponse;
import com.auth.ums.services.MessageNotification.MessageNotificationService;
import com.auth.ums.services.UserService.UserService;
import com.auth.ums.utility.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {
    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    MessageNotificationService notificationService;
    public String generateCompanyCode(String companyName) {

        // Remove spaces and special characters
        String prefix = companyName.replaceAll("[^A-Za-z]", "")
                .toUpperCase();

        // Ensure at least 3 characters
        if (prefix.length() >= 3) {
            prefix = prefix.substring(0, 3);
        } else {
            prefix = String.format("%-3s", prefix).replace(' ', 'X');
        }

        int sequence = 1;
        String companyCode;

        do {
            companyCode = prefix + String.format("%02d", sequence++);
        } while (companyRepository.existsByCompanyCode(companyCode));

        return companyCode;
    }

    @Override
    public ApiResponse<CompanyResponse> registerCompany(AddCompanyRequest request) {

        log.info("Register Company request received: {}", JsonUtils.toJson(request));

        try {

            Optional<Company> optional = companyRepository.findByEmailId(request.getEmailId());

            if (optional.isPresent()) {
                return ApiResponse.failure("Company Email Already Exists");
            }

            Optional<User> optionalEmail = userRepository.findByEmail(request.getEmailId());

            if (optionalEmail != null && !optionalEmail.isEmpty()) {
                return ApiResponse.failure("Email is Already Used by User");
            }
            Optional<User> optionalPhoneNumber = userRepository.findByPhoneNumber(request.getPhoneNumber());
            if (optionalPhoneNumber != null && !optionalPhoneNumber.isEmpty()) {
                return ApiResponse.failure("PhoneNumber is Already Used by User");
            }

            Company company = CompanyMapper.addCompany(request);

            company.setCompanyCode(generateCompanyCode(request.getCompanyName()));
            String creator = jwtUtil.getCurrentUsername();
            company.setCreatedBy(creator != null ? creator : "GUEST");
            company.setCreatedDate(LocalDateTime.now());
            company.setIsActive(true);
            company.setIsDeleted(false);

            companyRepository.save(company);

            CompanyResponse response = new CompanyResponse();
            response.setCompany(CompanyMapper.toCompanyDTO(company));

            log.info("Company registered successfully : {}", company.getCompanyCode());

            NameParts parts = Utility.splitFullName(request.getContactPersonName());

            AddUserRequest userRequest=new AddUserRequest();

            userRequest.setFirstName(parts.getFirstName());
            userRequest.setMiddleName(parts.getMiddleName());
            userRequest.setLastName(parts.getLastName());
            userRequest.setAge(0);
            userRequest.setAddress(request.getAddress());
            userRequest.setEmail(request.getEmailId());
            userRequest.setPhoneNumber(request.getPhoneNumber());
            userRequest.setPassword(PasswordUtil.generateRandomPassword());
            userService.addCompanyUser(userRequest,company.getCompanyCode());

            if (creator != null) {
                notificationService.push(NotificationHelper.companyCreated(creator, request.getCompanyName()));
            }
            notificationService.push(NotificationHelper.companyCreated(request.getEmailId(), request.getCompanyName()));

            return ApiResponse.success(response, "Company Registered Successfully");

        } catch (Exception e) {
            log.error("Error while registering company", e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<CompanyResponse> updateCompany(UpdateCompanyRequest request) {

        log.info("Update Company request : {}", JsonUtils.toJson(request));

        try {

            Optional<Company> optional = companyRepository.findById(request.getId());

            if (optional.isEmpty()) {
                return ApiResponse.failure("Company Not Found");
            }

            Company company = optional.get();

            if (company.getIsDeleted()) {
                return ApiResponse.failure("Company Not Found");
            }

            company = CompanyMapper.updateCompany(company, request);

            company.setUpdatedBy(jwtUtil.getCurrentUsername());
            company.setUpdatedDate(LocalDateTime.now());

            companyRepository.save(company);

            CompanyResponse response = new CompanyResponse();
            response.setCompany(CompanyMapper.toCompanyDTO(company));

            notificationService.push(NotificationHelper.companyUpdated(jwtUtil.getCurrentUsername(),request.getCompanyName()));
            notificationService.push(NotificationHelper.companyUpdated(request.getEmailId(),request.getCompanyName()));


            return ApiResponse.success(response, "Company Updated Successfully");

        } catch (Exception e) {
            log.error("Error while updating company", e);
            return ApiResponse.exception(e.getMessage());
        }
    }


    @Override
    public ApiResponse<CompanyResponse> getCompanyByCode(String companyCode) {

        log.info("Get Company By Code : {}", companyCode);

        Optional<Company> optional = companyRepository.findByCompanyCode(companyCode);

        if (optional.isEmpty()) {
            return ApiResponse.failure("Company Not Found");
        }

        Company company = optional.get();

        if (company.getIsDeleted()) {
            return ApiResponse.failure("Company Not Found");
        }

        CompanyResponse response = new CompanyResponse();
        response.setCompany(CompanyMapper.toCompanyDTO(company));

        return ApiResponse.success(response, "Fetch Successfully");
    }

    @Override
    public ApiResponse<CompanyResponse> getMyCompany() {
        Optional<User> optionalEmail = userRepository.findByEmail(jwtUtil.getCurrentUsername());
        String companyCode=optionalEmail.get().getSystemCode();
        log.info("Get Company By Code : {}", companyCode);

        Optional<Company> optional = companyRepository.findByCompanyCode(companyCode);

        if (optional.isEmpty()) {
            return ApiResponse.failure("Company Not Found");
        }

        Company company = optional.get();

        if (company.getIsDeleted()) {
            return ApiResponse.failure("Company Not Found");
        }

        CompanyResponse response = new CompanyResponse();
        response.setCompany(CompanyMapper.toCompanyDTO(company));

        return ApiResponse.success(response, "Fetch Successfully");
    }


    @Override
    public ApiResponse<CompanyResponse> getAllCompanies() {

        log.info("Get All Companies");

        try {

            List<Company> companies = companyRepository.findAllByIsDeletedFalse();

            if (companies.isEmpty()) {
                return ApiResponse.failure("No Company Found");
            }

            CompanyResponse response = new CompanyResponse();
            response.setCompanies(CompanyMapper.toCompanyDTOList(companies));

            return ApiResponse.success(response, "Fetch Successfully");

        } catch (Exception e) {
            log.error("Error while fetching companies", e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<CompanyResponse> getCompanyById(Long id) {

        log.info("Get Company By Id : {}", id);

        Optional<Company> optional = companyRepository.findById(id);

        if (optional.isEmpty()) {
            return ApiResponse.failure("Company Not Found");
        }

        Company company = optional.get();

        if (company.getIsDeleted()) {
            return ApiResponse.failure("Company Not Found");
        }

        CompanyResponse response = new CompanyResponse();
        response.setCompany(CompanyMapper.toCompanyDTO(company));

        return ApiResponse.success(response, "Fetch Successfully");
    }

    @Override
    public ApiResponse<CompanyResponse> deleteCompany(DeleteCompanyRequest request) {

        log.info("Delete Company request : {}", JsonUtils.toJson(request));

        try {

            Optional<Company> optional = companyRepository.findById(request.getId());

            if (optional.isEmpty()) {
                return ApiResponse.failure("Company Not Found");
            }

            Company company = optional.get();

            if (company.getIsDeleted()) {
                return ApiResponse.failure("Company Not Found");
            }

            company.setIsDeleted(true);
            company.setIsActive(false);
            company.setRemarks(request.getRemarks());
            company.setUpdatedBy(jwtUtil.getCurrentUsername());
            company.setUpdatedDate(LocalDateTime.now());

            companyRepository.save(company);

            CompanyResponse response = new CompanyResponse();
            response.setCompany(CompanyMapper.toCompanyDTO(company));

            notificationService.push(NotificationHelper.genericDeleted(jwtUtil.getCurrentUsername(),company.getCompanyName()));
            notificationService.push(NotificationHelper.genericDeleted(company.getEmailId(),company.getCompanyName()));


            return ApiResponse.success(response, "Company Deleted Successfully");

        } catch (Exception e) {
            log.error("Error while deleting company", e);
            return ApiResponse.exception(e.getMessage());
        }
    }

}
