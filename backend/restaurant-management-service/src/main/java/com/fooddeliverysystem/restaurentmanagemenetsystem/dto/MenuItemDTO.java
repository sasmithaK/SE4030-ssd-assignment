package com.fooddeliverysystem.restaurentmanagemenetsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemDTO {
    private String id;
    private String name;
    private String description;
    private double price;
    private String restaurantId;
    private String category;
}