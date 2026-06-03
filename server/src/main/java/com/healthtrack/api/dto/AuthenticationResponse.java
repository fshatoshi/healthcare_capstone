package com.healthtrack.api.dto;

import com.healthtrack.api.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private String firstName;
    private String lastName;
    private String email;
    private String role; // Changed from User.Role to String for simplicity in JSON
    private String userId;
    private String dob;
    private String language;
}
