# Hotel Inventory Management System

A complete hotel inventory management system with micro-frontend architecture, featuring admin and user services with full CRUD operations, real-time analytics, and comprehensive reporting.

## 🏗️ Architecture

- **Backend**: Spring Boot REST API with MySQL database
- **Frontend**: React Micro-frontend architecture
  - **Admin Service**: Complete inventory, category, supplier, and user management
  - **User Service**: User-specific inventory operations
  - **Shared Library**: Common components, utilities, and API services

## 🚀 Features

### Admin Service Features
- **Dashboard**: Real-time statistics and analytics
- **Inventory Management**: Full CRUD operations for inventory items
- **Category Management**: Organize items by categories
- **Supplier Management**: Manage supplier information
- **User Management**: System user administration
- **Reports & Analytics**: Comprehensive reporting system

### User Service Features
- **User Profile Management**: Personal profile operations
- **Inventory Viewing**: Browse and search inventory
- **Request System**: Create inventory requests

### Backend Features
- **RESTful API**: Complete REST endpoints
- **Database Integration**: MySQL with JPA/Hibernate
- **Admin Analytics**: Special admin-only endpoints
- **CORS Support**: Cross-origin resource sharing
- **Swagger Documentation**: API documentation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or later
- **Maven 3.8+**
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **Git**

## 🛠️ Setup Instructions

### 1. Database Setup

1. Install and start MySQL server
2. Create database:
```sql
CREATE DATABASE hotel_inventory;
```
3. Update database credentials in `Backend/src/main/resources/application.properties` if needed:
```properties
spring.datasource.username=root
spring.datasource.password=
```

### 2. Backend Setup

```bash
cd Backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8082`

### 3. Frontend Setup

#### Install dependencies for all micro-frontends:

```bash
# Shared library
cd frontend/micro-frontend/shared-lib
npm install

# Admin service
cd ../admin-service
npm install

# User service
cd ../user-service
npm install
```

#### Start the services:

```bash
# Admin service (Terminal 1)
cd frontend/micro-frontend/admin-service
npm run dev
# Runs on http://localhost:5173

# User service (Terminal 2)
cd frontend/micro-frontend/user-service
npm run dev
# Runs on http://localhost:5174
```

### 4. Quick Start (Windows)

For Windows users, simply run the batch file:
```bash
start-services.bat
```

This will:
- Guide you through database setup
- Start the backend service
- Install all frontend dependencies
- Start both frontend services

## 🌐 Access Points

- **Backend API**: http://localhost:8082
- **Admin Service**: http://localhost:5173
- **User Service**: http://localhost:5174
- **API Documentation**: http://localhost:8082/swagger-ui.html

## 📱 Usage Guide

### Admin Service

1. **Dashboard**: View system statistics, low stock alerts, and recent activity
2. **Inventory Management**:
   - Add new inventory items
   - Edit existing items
   - Delete items
   - Search and filter items
3. **Category Management**: Create and manage item categories
4. **Supplier Management**: Manage supplier information and contacts
5. **User Management**: Add system users with different roles
6. **Reports**: Generate inventory, category, and supplier reports

### User Service

1. **Profile Management**: Update personal information
2. **Inventory Browse**: View available inventory items
3. **Search**: Find specific items by name, category, or supplier

## 🔧 API Endpoints

### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/{id}` - Update inventory item
- `DELETE /api/inventory/{id}` - Delete inventory item

### Category Management
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Supplier Management
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### Admin Analytics
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/inventory/low-stock` - Get low stock items
- `GET /api/admin/inventory/out-of-stock` - Get out of stock items
- `GET /api/admin/reports/inventory` - Get inventory report
- `GET /api/admin/reports/categories` - Get category report
- `GET /api/admin/reports/suppliers` - Get supplier report

## 🏛️ Project Structure

```
office works/
├── Backend/                          # Spring Boot backend
│   ├── src/main/java/com/example/hotel_inventory/
│   │   ├── controller/              # REST controllers
│   │   ├── model/                   # JPA entities
│   │   ├── repository/              # Data repositories
│   │   ├── service/                 # Business logic
│   │   ├── dto/                     # Data transfer objects
│   │   └── config/                  # Configuration classes
│   └── src/main/resources/
│       └── application.properties   # Application configuration
├── frontend/
│   └── micro-frontend/
│       ├── admin-service/           # Admin frontend
│       │   ├── src/
│       │   │   ├── components/      # React components
│       │   │   ├── pages/           # Page components
│       │   │   └── main.tsx         # Entry point
│       │   └── package.json
│       ├── user-service/            # User frontend
│       │   ├── src/
│       │   │   ├── components/      # React components
│       │   │   ├── pages/           # Page components
│       │   │   └── main.tsx         # Entry point
│       │   └── package.json
│       └── shared-lib/              # Shared components & utilities
│           ├── src/
│           │   ├── api/             # API service layer
│           │   ├── components/      # Reusable components
│           │   ├── types/           # TypeScript definitions
│           │   └── utils/           # Utility functions
│           └── package.json
├── start-services.bat               # Windows startup script
└── README.md                        # This file
```

## 🧪 Testing

### Backend Testing
```bash
cd Backend
mvn test
```

### Frontend Testing
```bash
cd frontend/micro-frontend/admin-service
npm test

cd ../user-service
npm test
```

## 🔒 Security Considerations

- The system currently uses mock authentication
- For production use, implement proper authentication and authorization
- Secure database connections with proper credentials
- Enable HTTPS for production deployments

## 🚀 Deployment

### Development
- Backend: Spring Boot embedded server
- Frontend: Vite development server

### Production
- Backend: Deploy as JAR file or containerize with Docker
- Frontend: Build static assets and serve with nginx or similar

## 🛠️ Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**
- **Swagger/OpenAPI**

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide React Icons**

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `application.properties`
   - Verify database `hotel_inventory` exists

2. **Port Already in Use**
   - Backend (8082): Change `server.port` in `application.properties`
   - Frontend: Vite will automatically find next available port

3. **CORS Issues**
   - Verify CORS configuration in `CorsConfig.java`
   - Check frontend URLs in backend CORS settings

4. **NPM Install Errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`, then reinstall

## 📞 Support

For support and questions:
- Check the issue tracker
- Review API documentation at `/swagger-ui.html`
- Verify all services are running on correct ports

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding! 🎉**
