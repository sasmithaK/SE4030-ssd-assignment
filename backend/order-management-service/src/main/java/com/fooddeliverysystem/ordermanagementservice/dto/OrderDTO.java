package com.fooddeliverysystem.ordermanagementservice.dto;

import com.fooddeliverysystem.ordermanagementservice.model.OrderStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private Long customerId;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private List<OrderItemDTO> orderItems;
}
