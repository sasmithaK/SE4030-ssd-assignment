package com.fooddeliverysystem.restaurentmanagemenetsystem.service;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.RestaurantDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.UserDTO;

import java.util.List;

public interface AdminService {
    UserDTO registerAdmin(UserDTO userDTO);
    List<UserDTO> getAllUsers();
    List<RestaurantDTO> getAllRestaurants();
    RestaurantDTO verifyRestaurant(String restaurantId, boolean verified);
    void processFinancialTransaction(String restaurantId, double amount);
}