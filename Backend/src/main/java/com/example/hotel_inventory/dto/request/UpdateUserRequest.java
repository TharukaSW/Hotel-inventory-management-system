package com.example.hotel_inventory.dto.request;

import com.example.hotel_inventory.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.Email;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {
    
    private String username;
    
    @Email(message = "Email should be valid")
    private String email;
    
    private String password;
    
    private String firstName;
    
    private String lastName;
    
    private User.UserRole role;
    
    private Boolean isActive;
}
