package com.fooddeliverysystem.restaurentmanagemenetsystem.service;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.MenuItemDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.RestaurantDTO;

import java.util.List;

public interface RestaurantService {
    RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO);
    List<RestaurantDTO> getAllRestaurants();
    RestaurantDTO getRestaurantById(String restaurantId);
    RestaurantDTO updateRestaurant(String restaurantId, RestaurantDTO restaurantDTO);
    RestaurantDTO updateAvailability(String restaurantId, boolean available);
    void deleteRestaurant(String restaurantId);
    
    MenuItemDTO addMenuItem(String restaurantId, MenuItemDTO menuItemDTO);
    MenuItemDTO updateMenuItem(String restaurantId, String menuItemId, MenuItemDTO menuItemDTO);
    void deleteMenuItem(String restaurantId, String menuItemId);
    List<MenuItemDTO> getMenuItems(String restaurantId);
    List<MenuItemDTO> getMenuItemsByCategory(String restaurantId, String category);
}