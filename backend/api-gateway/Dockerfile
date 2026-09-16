# Start from a lightweight Java 17 runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built JAR into the image
COPY target/api-gateway-1.0-SNAPSHOT.jar api-gateway.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java","-jar","api-gateway.jar"]
