package com.example.hotel_inventory.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_inventory.dto.UserDto;
import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(UserDto::fromEntity)
                .map(ResponseEntity::ok)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()).getBody();
    }

    @GetMapping("/mock-admin")







    
    public ResponseEntity<UserDto> getMockAdmin() {
        // Return a mock admin user for development
        User mockAdmin = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@hotel.com")
                .firstName("Admin")
                .lastName("User")
                .role(User.UserRole.ADMIN)
                .isActive(true)
                .build();
        
        return ResponseEntity.ok(UserDto.fromEntity(mockAdmin));
    }
}

