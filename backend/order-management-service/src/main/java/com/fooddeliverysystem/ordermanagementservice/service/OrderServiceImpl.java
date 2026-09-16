package com.fooddeliverysystem.ordermanagementservice.service;

import com.fooddeliverysystem.ordermanagementservice.dto.OrderDTO;
import com.fooddeliverysystem.ordermanagementservice.dto.OrderItemDTO;
import com.fooddeliverysystem.ordermanagementservice.model.*;
import com.fooddeliverysystem.ordermanagementservice.repository.CustomerRepository;
import com.fooddeliverysystem.ordermanagementservice.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

   
    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // Validate customer exists
        Customer customer = customerRepository.findById(orderDTO.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        // Validate order items
        if (orderDTO.getOrderItems() == null || orderDTO.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // Create new order
        Order order = Order.builder()
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .customer(customer)
                .build();

        // Add order items with validation
        Order finalOrder = order;
        List<OrderItem> orderItems = orderDTO.getOrderItems().stream()
                .map(itemDTO -> {
                    validateOrderItem(itemDTO);
                    return OrderItem.builder()
                            .name(itemDTO.getName())
                            .price(itemDTO.getPrice())
                            .portion(itemDTO.getPortion())
                            .specialInstructions(itemDTO.getSpecialInstructions())
                            .qty(itemDTO.getQty())
                            .order(finalOrder)
                            .build();
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        order = orderRepository.save(order);
        
        return convertToOrderDTO(order);
    }

    private void validateOrderItem(OrderItemDTO itemDTO) {
        if (itemDTO.getName() == null || itemDTO.getName().isEmpty()) {
            throw new IllegalArgumentException("Item name is required");
        }
        if (itemDTO.getPrice() == null || itemDTO.getPrice().isEmpty()) {
            throw new IllegalArgumentException("Item price is required");
        }
        if (itemDTO.getQty() == null || itemDTO.getQty() <= 0) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
    }

    @Override
    public OrderDTO updateOrderItem(Long orderId, Long itemId, Long customerId, OrderItemDTO itemDTO) {
        Order order = orderRepository.findByIdAndCustomerId(orderId, customerId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Order not found or doesn't belong to customer"));
    
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Only pending orders can be modified");
        }
    
        OrderItem itemToUpdate = order.getOrderItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Order item not found"));
    
        // Update the item properties
        itemToUpdate.setPortion(itemDTO.getPortion());
        itemToUpdate.setQty(itemDTO.getQty());
        itemToUpdate.setSpecialInstructions(itemDTO.getSpecialInstructions());
    
        order = orderRepository.save(order);
        return convertToOrderDTO(order);
    }
    @Override
    public OrderDTO getCustomerOrder(Long orderId, Long customerId) {
        Order order = orderRepository.findByIdAndCustomerId(orderId, customerId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Order not found or doesn't belong to customer"));
        return convertToOrderDTO(order);
    }

    @Override
    public List<OrderDTO> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
@Transactional
public void cancelCustomerOrder(Long orderId, Long customerId) {
    Order order = orderRepository.findByIdAndCustomerId(orderId, customerId)
            .orElseThrow(() -> new EntityNotFoundException(
                    "Order not found or doesn't belong to customer"));

    if (order.getStatus() != OrderStatus.PENDING) {
        throw new IllegalStateException("Only pending orders can be cancelled");
    }

    // This will cascade delete all order items if properly mapped
    orderRepository.delete(order);
    
    // Alternatively, if you need to handle deletion manually:
    // orderItemRepository.deleteAllByOrderId(orderId);
    // orderRepository.delete(order);
}

    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = OrderDTO.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus()) // Changed to use enum directly
                .build();

        if (order.getOrderItems() != null) {
            orderDTO.setOrderItems(order.getOrderItems().stream()
                    .map(this::convertToOrderItemDTO)
                    .collect(Collectors.toList()));
        }

        return orderDTO;
    }

    private OrderItemDTO convertToOrderItemDTO(OrderItem orderItem) {
        return OrderItemDTO.builder()
                .id(orderItem.getId())
                .name(orderItem.getName())
                .price(orderItem.getPrice())
                .portion(orderItem.getPortion())
                .specialInstructions(orderItem.getSpecialInstructions())
                .qty(orderItem.getQty())
                .build();
    }
}
