package com.fooddeliverysystem.devliverymanagementservice.dto;

import lombok.Data;

// VULNERABLE (VULN-6): no validation constraints on any field — null, empty,
// or malformed values (e.g. invalid email) are silently accepted by the API
@Data
public class DriverDTO {
    private String fullName;   // Needed for registration
    private String email;
    private String phone;      // Needed for registration
    private String vehicle;    // Needed for registration
    private String password;
}

