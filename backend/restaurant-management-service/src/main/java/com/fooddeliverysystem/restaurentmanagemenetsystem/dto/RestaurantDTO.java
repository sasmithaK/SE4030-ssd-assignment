package com.fooddeliverysystem.restaurentmanagemenetsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
// [VULN-6] SECURITY ISSUE - No input validation on DTO fields
// Missing @NotBlank/@Email/@Size constraints - null/invalid data is accepted
public class RestaurantDTO {
    private String id;
    @NotBlank(message = "Restaurant name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @NotBlank(message = "Restaurant name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    @NotBlank(message = "Address is required")
    private String address;
    private boolean available;
    private boolean verified; // Added verification status
}