# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the jar file
RUN mvn clean package -DskipTests

# Stage 2: Run the application
# Using eclipse-temurin instead of openjdk
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the specifically named jar file from the build stage
# Note: Verified name is ChatAI-0.0.1-SNAPSHOT.jar
COPY --from=build /app/target/ChatAI-0.0.1-SNAPSHOT.jar app.jar

# Expose the port Spring Boot runs on
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
