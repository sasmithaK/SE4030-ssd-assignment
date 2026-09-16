package com.fooddeliverysystem.restaurentmanagemenetsystem.controller;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.MenuItemDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.RestaurantDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    // Restaurant Endpoints
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RestaurantDTO createRestaurant(@RequestBody RestaurantDTO restaurantDTO) {
        return restaurantService.createRestaurant(restaurantDTO);
    }

    @GetMapping
    public List<RestaurantDTO> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{restaurantId}")
    public RestaurantDTO getRestaurantById(@PathVariable String restaurantId) {
        return restaurantService.getRestaurantById(restaurantId);
    }

    @PutMapping("/{restaurantId}")
    public RestaurantDTO updateRestaurant(@PathVariable String restaurantId,
                                        @RequestBody RestaurantDTO restaurantDTO) {
        return restaurantService.updateRestaurant(restaurantId, restaurantDTO);
    }

    @PutMapping("/{restaurantId}/status")
    public RestaurantDTO setRestaurantStatus(@PathVariable String restaurantId,
                                           @RequestParam boolean available) {
        return restaurantService.updateAvailability(restaurantId, available);
    }

    @DeleteMapping("/{restaurantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRestaurant(@PathVariable String restaurantId) {
        restaurantService.deleteRestaurant(restaurantId);
    }

    // Menu Item Endpoints
    @GetMapping("/{restaurantId}/menu")
    public List<MenuItemDTO> getAllMenuItems(@PathVariable String restaurantId) {
        return restaurantService.getMenuItems(restaurantId);
    }

    @PostMapping("/{restaurantId}/menu")
    @ResponseStatus(HttpStatus.CREATED)
    public MenuItemDTO addMenuItem(@PathVariable String restaurantId,
                                 @RequestBody MenuItemDTO menuItemDTO) {
        return restaurantService.addMenuItem(restaurantId, menuItemDTO);
    }

    @PutMapping("/{restaurantId}/menu/{menuItemId}")
    public MenuItemDTO updateMenuItem(@PathVariable String restaurantId,
                                    @PathVariable String menuItemId,
                                    @RequestBody MenuItemDTO menuItemDTO) {
        return restaurantService.updateMenuItem(restaurantId, menuItemId, menuItemDTO);
    }

    @DeleteMapping("/{restaurantId}/menu/{menuItemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenuItem(@PathVariable String restaurantId,
                             @PathVariable String menuItemId) {
        restaurantService.deleteMenuItem(restaurantId, menuItemId);
    }
}