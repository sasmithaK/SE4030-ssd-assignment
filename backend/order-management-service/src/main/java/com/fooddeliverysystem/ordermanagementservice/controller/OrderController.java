package com.fooddeliverysystem.ordermanagementservice.controller;

import com.fooddeliverysystem.ordermanagementservice.dto.OrderDTO;
import com.fooddeliverysystem.ordermanagementservice.dto.OrderItemDTO;
import com.fooddeliverysystem.ordermanagementservice.service.OrderService;
import com.fooddeliverysystem.ordermanagementservice.service.CustomerService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;
    private final CustomerService customerService;

    // [FIX VULN-7] Verify that the authenticated user is the actual owner of the customer profile
    private void verifyCustomerOwnership(Long customerId) {
        String loggedInEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.fooddeliverysystem.ordermanagementservice.dto.CustomerDTO customer = customerService.getCustomerById(customerId);
        if (!customer.getEmail().equals(loggedInEmail)) {
            throw new org.springframework.security.access.AccessDeniedException("You don't have permission to access these orders");
        }
    }

    @PostMapping("/customer/{customerId}")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDTO createOrderForCustomer(
            @PathVariable Long customerId,
            @Valid @RequestBody OrderDTO orderDTO) {
        verifyCustomerOwnership(customerId);
        orderDTO.setCustomerId(customerId); // Set customer ID from path
        return orderService.createOrder(orderDTO);
    }

  // In OrderController.java
@PatchMapping("/{orderId}/items/{itemId}/customer/{customerId}")
public OrderDTO updateOrderItem(
        @PathVariable Long orderId,
        @PathVariable Long itemId,
        @PathVariable Long customerId,
        @Valid @RequestBody OrderItemDTO itemDTO) {
    verifyCustomerOwnership(customerId);
    return orderService.updateOrderItem(orderId, itemId, customerId, itemDTO);
}

    @GetMapping("/{orderId}/customer/{customerId}")
    public OrderDTO getCustomerOrder(
            @PathVariable Long orderId,
            @PathVariable Long customerId) {
        verifyCustomerOwnership(customerId);
        return orderService.getCustomerOrder(orderId, customerId);
    }

    @GetMapping("/customer/{customerId}")
    public List<OrderDTO> getOrdersByCustomer(@PathVariable Long customerId) {
        verifyCustomerOwnership(customerId);
        return orderService.getOrdersByCustomer(customerId);
    }

    @DeleteMapping("/{orderId}/customer/{customerId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelCustomerOrder(
            @PathVariable Long orderId,
            @PathVariable Long customerId) {
        verifyCustomerOwnership(customerId);
        orderService.cancelCustomerOrder(orderId, customerId);
    }
}