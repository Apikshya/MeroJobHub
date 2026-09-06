package com.auth.ums.repository;

import com.auth.ums.enums.ReadStatus;
import com.auth.ums.models.MessageNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface MessageNotificationRepository extends JpaRepository<MessageNotification, Long> {

    List<MessageNotification> findByUsernameAndIsDeletedFalseOrderByCreatedDateDesc(String username);

    List<MessageNotification> findByUsernameAndStatusAndIsDeletedFalseOrderByCreatedDateDesc(
            String username, ReadStatus status);

    @Modifying
    @Query("UPDATE MessageNotification n SET n.status = 'READ', n.readDate = :readDate, n.updatedDate = :readDate " +
            "WHERE n.id = :id")
    int markAsRead(@Param("id") Long id, @Param("readDate") LocalDateTime readDate);

    @Modifying
    @Query("UPDATE MessageNotification n SET n.status = 'READ', n.readDate = :readDate, n.updatedDate = :readDate " +
            "WHERE n.username = :username AND n.status = 'UNREAD' AND n.isDeleted = false")
    int markAllAsRead(@Param("username") String username, @Param("readDate") LocalDateTime readDate);

    List<MessageNotification> findByUsernameAndStatusAndIsDeletedFalse(String username, ReadStatus readStatus);

}