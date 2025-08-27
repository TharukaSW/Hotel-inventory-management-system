package com.example.hotel_inventory.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SampleUserLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        addUserIfNotExists("sampleadmin", "sampleadmin@hotel.com", "sampleadmin123", User.UserRole.ADMIN);
        addUserIfNotExists("samplefront", "samplefront@hotel.com", "samplefront123", User.UserRole.FRONT_DESK);
        addUserIfNotExists("samplestock", "samplestock@hotel.com", "samplestock123", User.UserRole.STOCK_MANAGER);
        addUserIfNotExists("sampleinspector", "sampleinspector@hotel.com", "sampleinspect123", User.UserRole.INSPECTOR);
    }

    private void addUserIfNotExists(String username, String email, String rawPassword, User.UserRole role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .firstName(username)
                    .lastName("User")
                    .role(role)
                    .isActive(true)
                    .build();
            userRepository.save(user);
        }
    }
}
