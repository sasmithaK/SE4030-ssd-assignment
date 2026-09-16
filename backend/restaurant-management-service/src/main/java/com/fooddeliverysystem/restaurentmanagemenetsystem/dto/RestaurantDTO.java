package com.fooddeliverysystem.restaurentmanagemenetsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
    private String id;
    private String name;
    private String address;
    private boolean available;
    private boolean verified; // Added verification status
}