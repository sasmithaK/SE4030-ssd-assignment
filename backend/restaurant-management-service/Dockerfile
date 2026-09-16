# Use an official OpenJDK base image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the application jar file (adjust path and jar name as needed)
COPY target/restaurant-management-service-1.0-SNAPSHOT.jar restaurant-management.jar

# Expose the application port (e.g., 8086)
EXPOSE 8082

# Run the jar
ENTRYPOINT ["java", "-jar", "restaurant-management.jar"]
