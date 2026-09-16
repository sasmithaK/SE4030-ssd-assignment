package com.fooddeliverysystem.ordermanagementservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {
    private Long id;
    // TODO [VULN-6] Security Vulnerability (A03: Injection):
    // Missing validation annotations (e.g., @NotBlank, @Email, @Size).
    private String fullname;
    private String email;
    private String phoneNumber;
    private String deliveryAddress;
    private String password;
    private String confirmPassword;
}
