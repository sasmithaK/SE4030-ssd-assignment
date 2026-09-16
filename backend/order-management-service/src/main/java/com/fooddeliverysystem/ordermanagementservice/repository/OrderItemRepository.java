package com.fooddeliverysystem.ordermanagementservice.repository;

import com.fooddeliverysystem.ordermanagementservice.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
