package com.drones.fct.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drones.fct.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
}
