package com.devaraj.AIClone.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devaraj.AIClone.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}
