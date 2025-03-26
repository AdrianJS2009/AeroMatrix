package com.drones.fct.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.drones.fct.domain.User;
import com.drones.fct.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public User createUser(User user) {
    // Password encoded
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }

  public User updateUser(Long id, User updatedUser) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
    user.setUsername(updatedUser.getUsername());
    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
      user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
    }
    user.setRole(updatedUser.getRole());
    return userRepository.save(user);
  }

  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }

  public User getUser(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  public List<User> listUsers() {
    return userRepository.findAll();
  }
}
