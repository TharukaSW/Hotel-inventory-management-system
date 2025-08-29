package com.example.hotel_inventory.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hotel_inventory.dto.UserDto;
import com.example.hotel_inventory.dto.request.CreateUserRequest;
import com.example.hotel_inventory.dto.request.UpdateUserRequest;
import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserDto::fromEntity);
    }

    public Optional<UserDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(UserDto::fromEntity);
    }

    public UserDto createUser(CreateUserRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

    User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
        // Store encoded (hashed) password
        .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
                .isActive(request.isActive())
                .build();

        User savedUser = userRepository.save(user);
        return UserDto.fromEntity(savedUser);
    }

    public UserDto updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if username is being changed and if it already exists
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already exists: " + request.getUsername());
            }
            user.setUsername(request.getUsername());
        }

        // Check if email is being changed and if it already exists
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        // Update other fields if provided
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getIsActive() != null) {
            user.setActive(request.getIsActive());
        }

        User updatedUser = userRepository.save(user);
        return UserDto.fromEntity(updatedUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Password encoding is handled via Spring's PasswordEncoder bean (BCrypt)
}
