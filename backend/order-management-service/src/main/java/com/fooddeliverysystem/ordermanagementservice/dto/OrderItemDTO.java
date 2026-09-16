package com.fooddeliverysystem.ordermanagementservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long id;
    private String name;
    private String price;
    private String portion;
    private String specialInstructions;
    private Integer qty;
}