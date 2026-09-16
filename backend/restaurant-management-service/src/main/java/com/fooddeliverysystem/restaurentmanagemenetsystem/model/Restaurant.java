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
@Document(collection = "restaurants")
public class Restaurant {
    @Id
    private String id;
    private String name;
    private String address;
    private boolean available;
    private boolean verified; // Added this field
}