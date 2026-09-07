package com.auth.ums.repository;

import com.auth.ums.models.User;
import com.auth.ums.responsemodels.user.UserCountProjection;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(@NotBlank(message = "Email is Required ") String email);

    Optional<User> findByPhoneNumber(@NotBlank(message = "PhoneNumber is Required ") String phoneNumber);

    Optional<User> findByEmailAndIsActive(@NotBlank(message = "Email is Required ") String email, boolean isActive);

    Optional<User> findByIdAndIsActive(Long id, boolean isActive);

    Page<User> findAll(Specification<User> spec, Pageable pageable);

    List<User> findAllByIsDeletedFalse();

    @Query(value = """
            SELECT *
            FROM users u
            WHERE u.created_date > NOW() - INTERVAL '4 days'
            AND u.is_deleted = false
            ORDER BY u.created_date DESC
            LIMIT 10
            """, nativeQuery = true)
    List<User> findTop10RecentUsers();

    @Query(value = """
        SELECT 
            COUNT(id) AS totalUsers,
            COUNT(id) FILTER (WHERE user_type = 'CUSTOMER') AS totalCustomers,
            COUNT(id) FILTER (WHERE user_type = 'COMPANY_ADMIN') AS totalCompanyAdmins
        FROM users
        WHERE is_deleted = false
        """, nativeQuery = true)
    UserCountProjection getUserCounts();

}

