// RestaurantRepository.java
package com.fooddeliverysystem.restaurentmanagemenetsystem.repository;

import com.fooddeliverysystem.restaurentmanagemenetsystem.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
}