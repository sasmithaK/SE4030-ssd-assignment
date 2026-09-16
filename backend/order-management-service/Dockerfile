# Use an official OpenJDK base image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the application jar file (adjust path and jar name as needed)
COPY target/order-management-service-1.0-SNAPSHOT.jar order-management.jar

# Expose the application port (e.g., 8085)
EXPOSE 8083

# Run the jar
ENTRYPOINT ["java", "-jar", "order-management.jar"]
