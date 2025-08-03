# Hotel Inventory Management System - Backend

This is the enhanced backend for the Hotel Inventory Management System, designed to work seamlessly with the micro-frontend architecture.

## Features

### Enhanced Models
- **User Management**: Complete user system with roles (ADMIN, FRONT_DESK, STOCK_MANAGER)
- **Inventory Items**: Enhanced with descriptions, min/max quantities, and audit fields
- **Categories**: Added descriptions and active status
- **Suppliers**: Comprehensive supplier information including contact details
- **Stock Transactions**: Detailed transaction tracking with reasons and user attribution

### API Endpoints

#### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/{id}` - Get specific inventory item
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/{id}` - Update inventory item
- `DELETE /api/inventory/{id}` - Delete inventory item
- `GET /api/inventory/low-stock` - Get items with low stock
- `GET /api/inventory/out-of-stock` - Get out of stock items
- `GET /api/inventory/stats` - Get inventory statistics

#### Category Management
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get specific category
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

#### Supplier Management
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/{id}` - Get specific supplier
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

#### User Management
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get specific user
- `GET /api/users/mock-admin` - Get mock admin user for development

#### Stock Transactions
- `POST /api/inventory/transaction` - Create stock transaction
- `GET /api/inventory/{itemId}/transactions` - Get transactions for specific item

## Technology Stack

- **Java 17**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **MySQL Database**
- **Lombok**
- **Spring Security (for password encoding)**
- **OpenAPI/Swagger**

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Setup Instructions

### 1. Database Setup
```sql
CREATE DATABASE hotel_inventory;
```

### 2. Configuration
Update `application.properties` with your database credentials:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build and Run
```bash
# Navigate to backend directory
cd Backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Sample Data
The application automatically initializes with sample data including:
- 5 categories (Bathroom Supplies, Kitchen Supplies, Cleaning Supplies, Bedding, Electronics)
- 3 suppliers (Hotel Supply Co., Quality Linens Inc., CleanPro Solutions)
- 6 inventory items with various stock levels
- 3 users (admin, frontdesk, stockmanager)

## API Documentation

Once the application is running, you can access:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI Docs**: `http://localhost:8080/v3/api-docs`

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `http://localhost:3001` (Admin service)
- `http://localhost:5173` (Vite development server)

## Data Transfer Objects (DTOs)

The API uses DTOs for clean data contracts:

### Request DTOs
- `CreateInventoryItemRequest` - For creating/updating inventory items
- `CreateCategoryRequest` - For creating/updating categories
- `CreateSupplierRequest` - For creating/updating suppliers

### Response DTOs
- `InventoryItemDto` - Inventory item response
- `CategoryDto` - Category response
- `SupplierDto` - Supplier response
- `UserDto` - User response
- `InventoryStats` - Dashboard statistics

## Error Handling

The application includes comprehensive error handling:
- **Validation Errors**: Detailed field-level validation messages
- **Runtime Errors**: Proper HTTP status codes and error messages
- **Global Exception Handler**: Consistent error response format

## Database Schema

### Tables
- `users` - User management
- `categories` - Product categories
- `suppliers` - Supplier information
- `inventory_items` - Inventory items
- `stock_transactions` - Stock movement tracking

### Key Features
- **Audit Fields**: All entities include `created_at` and `updated_at` timestamps
- **Soft Deletes**: Entities can be marked as inactive rather than deleted
- **Foreign Key Relationships**: Proper relationships between entities
- **Enum Types**: Status and role enums for type safety

## Development

### Adding New Features
1. Create entity in `model` package
2. Create repository in `repository` package
3. Create DTOs in `dto` package
4. Create service interface and implementation
5. Create controller with proper validation
6. Add to data initializer if needed

### Testing
```bash
# Run tests
mvn test

# Run with coverage
mvn jacoco:report
```

## Deployment

### Production Configuration
Update `application.properties` for production:
```properties
spring.profiles.active=prod
spring.jpa.hibernate.ddl-auto=validate
logging.level.root=WARN
```

### Docker Support
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/hotel-inventory-*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## Contributing

1. Follow the existing code structure
2. Add proper validation and error handling
3. Include unit tests for new features
4. Update documentation as needed

## License

This project is part of the Hotel Inventory Management System. 