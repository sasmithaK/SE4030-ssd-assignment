package com.fooddeliverysystem.devliverymanagementservice.dto;

import lombok.Data;

@Data
public class DriverDTO {
    private String fullName;   // Needed for registration
    private String email;
    private String phone;      // Needed for registration
    private String vehicle;    // Needed for registration
    private String password;
}

