package com.fooddeliverysystem.ordermanagementservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long id;

    @NotBlank(message = "Item name is required")
    private String name;

    @NotBlank(message = "Price is required")
    private String price;

    @NotBlank(message = "Portion is required")
    private String portion;

    private String specialInstructions;

    @NotNull(message = "Quantity is required")
    private Integer qty;
}