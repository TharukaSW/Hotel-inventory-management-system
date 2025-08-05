package com.example.hotel_inventory.controller;

import com.example.hotel_inventory.dto.UserDto;
import com.example.hotel_inventory.dto.request.CreateUserRequest;
import com.example.hotel_inventory.dto.request.UpdateUserRequest;
import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserDto testUserDto;
    private CreateUserRequest createUserRequest;
    private UpdateUserRequest updateUserRequest;

    @BeforeEach
    void setUp() {
        testUserDto = UserDto.builder()
                .id(1L)
                .username("testuser")
                .email("test@hotel.com")
                .firstName("Test")
                .lastName("User")
                .role(User.UserRole.FRONT_DESK)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        createUserRequest = CreateUserRequest.builder()
                .username("newuser")
                .email("new@hotel.com")
                .password("password123")
                .firstName("New")
                .lastName("User")
                .role(User.UserRole.FRONT_DESK)
                .isActive(true)
                .build();

        updateUserRequest = UpdateUserRequest.builder()
                .firstName("Updated")
                .lastName("User")
                .role(User.UserRole.STOCK_MANAGER)
                .build();
    }

    @Test
    @WithMockUser
    void getAllUsers_ShouldReturnListOfUsers() throws Exception {
        List<UserDto> users = Arrays.asList(testUserDto);
        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].username").value("testuser"))
                .andExpect(jsonPath("$[0].email").value("test@hotel.com"));

        verify(userService).getAllUsers();
    }

    @Test
    @WithMockUser
    void getUserById_WhenUserExists_ShouldReturnUser() throws Exception {
        when(userService.getUserById(1L)).thenReturn(Optional.of(testUserDto));

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).getUserById(1L);
    }

    @Test
    @WithMockUser
    void getUserById_WhenUserNotExists_ShouldReturn404() throws Exception {
        when(userService.getUserById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isNotFound());

        verify(userService).getUserById(1L);
    }

    @Test
    @WithMockUser
    void getUserByUsername_WhenUserExists_ShouldReturnUser() throws Exception {
        when(userService.getUserByUsername("testuser")).thenReturn(Optional.of(testUserDto));

        mockMvc.perform(get("/api/users/username/testuser"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).getUserByUsername("testuser");
    }

    @Test
    @WithMockUser
    void createUser_WithValidRequest_ShouldCreateUser() throws Exception {
        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(testUserDto);

        mockMvc.perform(post("/api/users")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createUserRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).createUser(any(CreateUserRequest.class));
    }

    @Test
    @WithMockUser
    void createUser_WithInvalidRequest_ShouldReturn400() throws Exception {
        CreateUserRequest invalidRequest = CreateUserRequest.builder()
                .username("") // Invalid empty username
                .email("invalid-email") // Invalid email
                .password("")
                .build();

        mockMvc.perform(post("/api/users")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void updateUser_WithValidRequest_ShouldUpdateUser() throws Exception {
        UserDto updatedUser = UserDto.builder()
                .id(1L)
                .username("testuser")
                .email("test@hotel.com")
                .firstName("Updated")
                .lastName("User")
                .role(User.UserRole.STOCK_MANAGER)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(userService.updateUser(eq(1L), any(UpdateUserRequest.class))).thenReturn(updatedUser);

        mockMvc.perform(put("/api/users/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateUserRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.firstName").value("Updated"))
                .andExpect(jsonPath("$.role").value("STOCK_MANAGER"));

        verify(userService).updateUser(eq(1L), any(UpdateUserRequest.class));
    }

    @Test
    @WithMockUser
    void updateUser_WhenUserNotExists_ShouldReturn400() throws Exception {
        when(userService.updateUser(eq(1L), any(UpdateUserRequest.class)))
                .thenThrow(new RuntimeException("User not found"));

        mockMvc.perform(put("/api/users/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateUserRequest)))
                .andExpect(status().isBadRequest());

        verify(userService).updateUser(eq(1L), any(UpdateUserRequest.class));
    }

    @Test
    @WithMockUser
    void deleteUser_WhenUserExists_ShouldReturn204() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/users/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(1L);
    }

    @Test
    @WithMockUser
    void deleteUser_WhenUserNotExists_ShouldReturn404() throws Exception {
        doThrow(new RuntimeException("User not found")).when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/users/1")
                        .with(csrf()))
                .andExpect(status().isNotFound());

        verify(userService).deleteUser(1L);
    }

    @Test
    @WithMockUser
    void getMockAdmin_ShouldReturnMockAdminUser() throws Exception {
        mockMvc.perform(get("/api/users/mock-admin"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }
}
