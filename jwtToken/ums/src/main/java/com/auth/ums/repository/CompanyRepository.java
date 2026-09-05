package com.auth.ums.repository;

import com.auth.ums.models.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByCompanyCode(String companyCode);

    Optional<Company> findByEmailId(String emailId);

    boolean existsByCompanyCode(String companyCode);

    //boolean existsByEmailId(String emailId);

    @Query("select c from Company c where c.companyCode = :companyCode and c.isDeleted = false")
    Optional<Company> findActiveByCompanyCode(@Param("companyCode") String companyCode);

    List<Company> findAllByIsDeletedFalse();

    @Query(value = """
        SELECT COUNT(id)
        FROM company
        WHERE is_deleted = false
        """, nativeQuery = true)
    Long getTotalCompanies();

}

