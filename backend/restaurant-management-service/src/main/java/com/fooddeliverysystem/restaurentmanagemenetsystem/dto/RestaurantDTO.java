package com.fooddeliverysystem.restaurentmanagemenetsystem.dto;

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
    private String name;
    private String address;
    private boolean available;
    private boolean verified; // Added verification status
}