# Use an official JDK base image (adjust if needed)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the application jar file (adjust path and jar name as needed)
COPY target/delivery-management-service-1.0-SNAPSHOT.jar delivery-management.jar

# Expose the application port
EXPOSE 8084

# Run the jar
ENTRYPOINT ["java", "-jar", "delivery-management.jar"]
