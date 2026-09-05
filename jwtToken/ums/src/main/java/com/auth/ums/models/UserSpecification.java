package com.auth.ums.models;

import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {
    public static Specification<User> searchByKeyword(String keyword) {

        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction(); // no filter
            }

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("fullName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(root.get("phoneNumber"), pattern),
                    cb.like(cb.lower(root.get("address")), pattern)
            );
        };
    }
}
