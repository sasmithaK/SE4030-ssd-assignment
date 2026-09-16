package com.fooddeliverysystem.ordermanagementservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {
    private Long id;
    private String fullname;
    private String email;
    private String phoneNumber;
    private String deliveryAddress;
    private String password;
    private String confirmPassword;
}
