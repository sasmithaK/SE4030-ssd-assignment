package com.fooddeliverysystem.ordermanagementservice.service;

import com.fooddeliverysystem.ordermanagementservice.dto.OrderDTO;
import com.fooddeliverysystem.ordermanagementservice.dto.OrderItemDTO;
import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO updateOrderItem(Long orderId, Long itemId, Long customerId, OrderItemDTO itemDTO);
    OrderDTO getCustomerOrder(Long orderId, Long customerId);
    List<OrderDTO> getOrdersByCustomer(Long customerId);
    void cancelCustomerOrder(Long orderId, Long customerId);
}