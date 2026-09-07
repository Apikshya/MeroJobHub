package com.auth.ums.mapper;

import com.auth.ums.models.Company;
import com.auth.ums.requestmodels.Company.AddCompanyRequest;
import com.auth.ums.requestmodels.Company.UpdateCompanyRequest;
import com.auth.ums.responsemodels.Company.CompanyDTO;

import java.util.List;
import java.util.stream.Collectors;

public class CompanyMapper {

    public static Company addCompany(AddCompanyRequest request) {

        Company company = new Company();

        company.setCompanyName(request.getCompanyName());
        company.setEmailId(request.getEmailId());
        company.setPhoneNumber(request.getPhoneNumber());
        company.setWebsite(request.getWebsite());
        company.setIndustryType(request.getIndustryType());
        company.setCompanyType(request.getCompanyType());
        company.setRegistrationNumber(request.getRegistrationNumber());
        company.setTaxNumber(request.getTaxNumber());
        company.setCompanySize(request.getCompanySize());
        company.setEmployeeCount(request.getEmployeeCount());
        company.setFoundedYear(request.getFoundedYear());
        company.setContactPersonName(request.getContactPersonName());
        company.setContactPersonDesignation(request.getContactPersonDesignation());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setCountry(request.getCountry());
        company.setPostalCode(request.getPostalCode());
        company.setLogo(request.getLogo());
        company.setDescription(request.getDescription());
        company.setLinkedinUrl(request.getLinkedinUrl());
        company.setFacebookUrl(request.getFacebookUrl());
        company.setTwitterUrl(request.getTwitterUrl());

        return company;
    }

    public static Company updateCompany(Company company, UpdateCompanyRequest request) {

        company.setCompanyName(request.getCompanyName());
        company.setEmailId(request.getEmailId());
        company.setPhoneNumber(request.getPhoneNumber());
        company.setWebsite(request.getWebsite());
        company.setIndustryType(request.getIndustryType());
        company.setCompanyType(request.getCompanyType());
        company.setRegistrationNumber(request.getRegistrationNumber());
        company.setTaxNumber(request.getTaxNumber());
        company.setCompanySize(request.getCompanySize());
        company.setEmployeeCount(request.getEmployeeCount());
        company.setFoundedYear(request.getFoundedYear());
        company.setContactPersonName(request.getContactPersonName());
        company.setContactPersonDesignation(request.getContactPersonDesignation());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setCountry(request.getCountry());
        company.setPostalCode(request.getPostalCode());
        company.setLogo(request.getLogo());
        company.setDescription(request.getDescription());
        company.setLinkedinUrl(request.getLinkedinUrl());
        company.setFacebookUrl(request.getFacebookUrl());
        company.setTwitterUrl(request.getTwitterUrl());

        return company;
    }

    public static CompanyDTO toCompanyDTO(Company company) {

        if (company == null) {
            return null;
        }

        CompanyDTO dto = new CompanyDTO();

        dto.setId(company.getId());
        dto.setCompanyCode(company.getCompanyCode());
        dto.setCompanyName(company.getCompanyName());
        dto.setEmailId(company.getEmailId());
        dto.setPhoneNumber(company.getPhoneNumber());
        dto.setWebsite(company.getWebsite());
        dto.setIndustryType(company.getIndustryType());
        dto.setCompanyType(company.getCompanyType());
        dto.setRegistrationNumber(company.getRegistrationNumber());
        dto.setTaxNumber(company.getTaxNumber());
        dto.setCompanySize(company.getCompanySize());
        dto.setEmployeeCount(company.getEmployeeCount());
        dto.setFoundedYear(company.getFoundedYear());
        dto.setContactPersonName(company.getContactPersonName());
        dto.setContactPersonDesignation(company.getContactPersonDesignation());
        dto.setAddress(company.getAddress());
        dto.setCity(company.getCity());
        dto.setState(company.getState());
        dto.setCountry(company.getCountry());
        dto.setPostalCode(company.getPostalCode());
        dto.setLogo(company.getLogo());
        dto.setDescription(company.getDescription());
        dto.setLinkedinUrl(company.getLinkedinUrl());
        dto.setFacebookUrl(company.getFacebookUrl());
        dto.setTwitterUrl(company.getTwitterUrl());

        return dto;
    }

    public static List<CompanyDTO> toCompanyDTOList(List<Company> companies) {

        if (companies == null) {
            return List.of();
        }

        return companies.stream()
                .map(CompanyMapper::toCompanyDTO)
                .collect(Collectors.toList());
    }
}
