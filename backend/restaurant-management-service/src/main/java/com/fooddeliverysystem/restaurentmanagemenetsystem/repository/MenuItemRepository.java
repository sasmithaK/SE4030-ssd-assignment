package com.fooddeliverysystem.restaurentmanagemenetsystem.repository;

import com.fooddeliverysystem.restaurentmanagemenetsystem.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
    List<MenuItem> findByRestaurantId(String restaurantId);
    List<MenuItem> findByRestaurantIdAndCategory(String restaurantId, String category);
    
    @Query(value = "{'restaurantId': ?0}", delete = true)
    void deleteByRestaurantId(String restaurantId);
}