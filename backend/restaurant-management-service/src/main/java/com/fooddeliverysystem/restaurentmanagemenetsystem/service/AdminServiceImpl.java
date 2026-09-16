package com.fooddeliverysystem.restaurentmanagemenetsystem.service;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.RestaurantDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.UserDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.model.Restaurant;
import com.fooddeliverysystem.restaurentmanagemenetsystem.model.User;
import com.fooddeliverysystem.restaurentmanagemenetsystem.repository.RestaurantRepository;
import com.fooddeliverysystem.restaurentmanagemenetsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fooddeliverysystem.restaurentmanagemenetsystem.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    @Transactional
    public UserDTO registerAdmin(UserDTO userDTO) {
        

        User user = User.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .role(User.Role.fromString(userDTO.getRole()))
                .build();
        
        user = userRepository.save(user);
        return convertToUserDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantDTO> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::convertToRestaurantDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RestaurantDTO verifyRestaurant(String restaurantId, boolean verified) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        restaurant.setVerified(verified);
        restaurant = restaurantRepository.save(restaurant);
        return convertToRestaurantDTO(restaurant);
    }

    @Override
    @Transactional
    public void processFinancialTransaction(String restaurantId, double amount) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        // Actual implementation would interact with payment service
        System.out.println("Processed transaction of " + amount + " for restaurant " + restaurantId);
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    private RestaurantDTO convertToRestaurantDTO(Restaurant restaurant) {
        return RestaurantDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .available(restaurant.isAvailable())
                .verified(restaurant.isVerified())
                .build();
    }
}