package com.fooddeliverysystem.devliverymanagementservice.dto;

import com.fooddeliverysystem.devliverymanagementservice.model.Driver;
import lombok.AllArgsConstructor;
import lombok.Data;

// BONUS FIX: response-only DTO that excludes the password hash from API responses
@Data
@AllArgsConstructor
public class DriverResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String vehicle;

    public static DriverResponseDTO fromEntity(Driver driver) {
        return new DriverResponseDTO(
                driver.getId(),
                driver.getFullName(),
                driver.getEmail(),
                driver.getPhone(),
                driver.getVehicle()
        );
    }
}

