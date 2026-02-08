# Stage 1: Build (Optimized for low memory)
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Set Maven options to use less memory
ENV MAVEN_OPTS="-Xmx384m"

# Copy pom first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -e

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Using a wildcard (*) ensures it finds the jar even if the name varies slightly
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Run with memory constraints for the JRE
ENTRYPOINT ["java", "-Xmx384m", "-Xss512k", "-jar", "app.jar"]
