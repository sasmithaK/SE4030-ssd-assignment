package com.fooddeliverysystem.restaurentmanagemenetsystem.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "menu_items")
public class MenuItem {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String restaurantId;
    private String category; // Added this field
}