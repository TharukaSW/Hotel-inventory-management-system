# Multi-stage build for Spring Boot backend
# ---- Build stage ----
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
# Copy Maven wrapper and pom first for dependency layer caching
COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
# Copy source
COPY src src
RUN ./mvnw -q -DskipTests clean package

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
ENV JAVA_OPTS=""
ENV DB_URL="jdbc:mysql://db:3306/hotel_inventory?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true" \
    DB_USER="hotel" \
    DB_PW="change_me" \
    JWT_SECRET="change_me_secret" \
    SERVER_PORT=8082
# Copy built jar
COPY --from=build /app/target/hotel_inventory-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
