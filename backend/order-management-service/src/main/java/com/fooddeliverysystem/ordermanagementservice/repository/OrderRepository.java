package com.fooddeliverysystem.ordermanagementservice.repository;

import com.fooddeliverysystem.ordermanagementservice.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findById(Long orderId);
List<Order> findByCustomerId(Long customerId);
Optional<Order> findByIdAndCustomerId(Long orderId, Long customerId);
}
