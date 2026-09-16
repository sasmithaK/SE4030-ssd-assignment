package com.fooddeliverysystem.restaurentmanagemenetsystem.service;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.MenuItemDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.RestaurantDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.exception.ResourceNotFoundException;
import com.fooddeliverysystem.restaurentmanagemenetsystem.model.MenuItem;
import com.fooddeliverysystem.restaurentmanagemenetsystem.model.Restaurant;
import com.fooddeliverysystem.restaurentmanagemenetsystem.repository.MenuItemRepository;
import com.fooddeliverysystem.restaurentmanagemenetsystem.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    @Override
    @Transactional
    public RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO) {
        Restaurant restaurant = Restaurant.builder()
                .name(restaurantDTO.getName())
                .address(restaurantDTO.getAddress())
                .available(restaurantDTO.isAvailable())
                .verified(false) // New restaurants are unverified by default
                .build();
        
        restaurant = restaurantRepository.save(restaurant);
        return convertToDTO(restaurant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantDTO> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RestaurantDTO getRestaurantById(String restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        return convertToDTO(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDTO updateRestaurant(String restaurantId, RestaurantDTO restaurantDTO) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        
        restaurant.setName(restaurantDTO.getName());
        restaurant.setAddress(restaurantDTO.getAddress());
        restaurant.setAvailable(restaurantDTO.isAvailable());
        
        restaurant = restaurantRepository.save(restaurant);
        return convertToDTO(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDTO updateAvailability(String restaurantId, boolean available) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        
        restaurant.setAvailable(available);
        restaurant = restaurantRepository.save(restaurant);
        return convertToDTO(restaurant);
    }

    @Override
    @Transactional
    public void deleteRestaurant(String restaurantId) {
        // First delete all menu items associated with the restaurant
        menuItemRepository.deleteByRestaurantId(restaurantId);
        
        // Then delete the restaurant
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
                
        restaurantRepository.delete(restaurant);
    }

    @Override
    @Transactional
    public MenuItemDTO addMenuItem(String restaurantId, MenuItemDTO menuItemDTO) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }

        MenuItem menuItem = MenuItem.builder()
                .name(menuItemDTO.getName())
                .description(menuItemDTO.getDescription())
                .price(menuItemDTO.getPrice())
                .restaurantId(restaurantId)
                .category(menuItemDTO.getCategory())
                .build();
        
        menuItem = menuItemRepository.save(menuItem);
        return convertToMenuItemDTO(menuItem);
    }

    @Override
    @Transactional
    public MenuItemDTO updateMenuItem(String restaurantId, String menuItemId, MenuItemDTO menuItemDTO) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + menuItemId));

        if (!menuItem.getRestaurantId().equals(restaurantId)) {
            throw new IllegalArgumentException("Menu item does not belong to the specified restaurant");
        }

        menuItem.setName(menuItemDTO.getName());
        menuItem.setDescription(menuItemDTO.getDescription());
        menuItem.setPrice(menuItemDTO.getPrice());
        menuItem.setCategory(menuItemDTO.getCategory());
        
        menuItem = menuItemRepository.save(menuItem);
        return convertToMenuItemDTO(menuItem);
    }

    @Override
    @Transactional
    public void deleteMenuItem(String restaurantId, String menuItemId) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + menuItemId));

        if (!menuItem.getRestaurantId().equals(restaurantId)) {
            throw new IllegalArgumentException("Menu item does not belong to the specified restaurant");
        }

        menuItemRepository.delete(menuItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getMenuItems(String restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .map(this::convertToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getMenuItemsByCategory(String restaurantId, String category) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        
        return menuItemRepository.findByRestaurantIdAndCategory(restaurantId, category).stream()
                .map(this::convertToMenuItemDTO)
                .collect(Collectors.toList());
    }

    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        return RestaurantDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .available(restaurant.isAvailable())
                .verified(restaurant.isVerified())
                .build();
    }

    private MenuItemDTO convertToMenuItemDTO(MenuItem menuItem) {
        return MenuItemDTO.builder()
                .id(menuItem.getId())
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .restaurantId(menuItem.getRestaurantId())
                .category(menuItem.getCategory())
                .build();
    }
}