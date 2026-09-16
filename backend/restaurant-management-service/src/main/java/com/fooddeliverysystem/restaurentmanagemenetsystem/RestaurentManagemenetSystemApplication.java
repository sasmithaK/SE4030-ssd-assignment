package com.fooddeliverysystem.restaurentmanagemenetsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.fooddeliverysystem"})
public class RestaurentManagemenetSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestaurentManagemenetSystemApplication.class, args);
    }

}
