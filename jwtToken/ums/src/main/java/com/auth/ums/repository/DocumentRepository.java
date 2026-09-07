package com.auth.ums.repository;

import com.auth.ums.models.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    Optional<Document> findByFileName(String fileName);
    Optional<Document> findByOriginalFileName(String originalFileName);

    List<Document> findByCreatedBy(String email);
}