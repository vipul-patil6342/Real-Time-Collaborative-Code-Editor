package com.vipulpatil.code_editor.repository;

import com.vipulpatil.code_editor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT u FROM User u WHERE u.username = :identity OR u.email = :identity")
    Optional<User> findByUsernameOrEmail(@Param("identity") String identity);

}