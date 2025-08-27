package com.example.hotel_inventory.service;

import com.example.hotel_inventory.dto.request.LoginRequest;
import com.example.hotel_inventory.dto.response.LoginResponse;
import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.model.UserRole;
import com.example.hotel_inventory.repository.UserRepository;
import com.example.hotel_inventory.security.JwtUtil;
import com.example.hotel_inventory.service.impl.AuthServiceImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedPassword");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setRole(User.UserRole.ADMIN);
        testUser.setActive(true);

        // Setup login request
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void loginSuccess() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        when(jwtUtil.generateToken(any(User.class))).thenReturn("test.jwt.token");

        // Act
        LoginResponse response = authService.login(loginRequest, this.response);

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getUser());
        assertEquals("test@example.com", response.getUser().getEmail());
        verify(this.response).addCookie(any(Cookie.class));
    }

    @Test
    void loginFailureInvalidEmail() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // Act
        LoginResponse response = authService.login(loginRequest, this.response);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());
        verify(this.response, never()).addCookie(any(Cookie.class));
    }

    @Test
    void loginFailureInactiveUser() {
        // Arrange
        testUser.setActive(false);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        LoginResponse response = authService.login(loginRequest, this.response);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Account is inactive", response.getMessage());
        verify(this.response, never()).addCookie(any(Cookie.class));
    }

    @Test
    void loginFailureInvalidPassword() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(false);

        // Act
        LoginResponse response = authService.login(loginRequest, this.response);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());
        verify(this.response, never()).addCookie(any(Cookie.class));
    }
}
