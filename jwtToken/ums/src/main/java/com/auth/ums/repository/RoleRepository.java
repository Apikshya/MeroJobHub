package com.auth.ums.repository;

import com.auth.ums.models.Role;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByName(@NotBlank(message = "Name is Required ") String name);


    @Query(
            value = "SELECT r.* FROM roles r " +
                    "INNER JOIN user_role ur ON ur.role_id = r.id " +
                    "WHERE ur.user_id = :userId and ur.is_active=true and ur.is_deleted=false " +
                    "and  r.is_active=true and r.is_deleted=false",
            nativeQuery = true
    )
    List<Role> geUserRoleByUserId(@Param("userId") Long userId);

}
