# Frontdesk Service - Hotel Inventory Management System

## Overview

This document describes the implementation of a fully functional **Frontdesk Service** that includes both backend and frontend components, integrated with the existing hotel inventory management system.

## Architecture

### Backend (Spring Boot - Java)
- **Framework**: Spring Boot 3.5.4 with Java 17
- **Database**: MySQL with JPA/Hibernate
- **API**: RESTful services with OpenAPI/Swagger documentation
- **Security**: Spring Security integration
- **Validation**: Bean validation with Jakarta validation

### Frontend (React - TypeScript)
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React
- **Architecture**: Micro-frontend pattern

## Backend Implementation

### 1. Model Layer

#### Frontdesk Entity (`src/main/java/com/example/hotel_inventory/model/Frontdesk.java`)
```java
@Entity
@Table(name = "frontdesk")
public class Frontdesk {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private String roomNumber;
    private String roomType;
    
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
    
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
    private LocalDateTime expectedCheckIn;
    private LocalDateTime expectedCheckOut;
    
    private Integer numberOfGuests;
    private String specialRequests;
    private Double totalAmount;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    
    // ... other fields and methods
}
```

**Enums**:
- `BookingStatus`: RESERVED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW
- `PaymentStatus`: PENDING, PARTIAL, PAID, REFUNDED

### 2. Repository Layer

#### FrontdeskRepository (`src/main/java/com/example/hotel_inventory/repository/FrontdeskRepository.java`)
```java
@Repository
public interface FrontdeskRepository extends JpaRepository<Frontdesk, Long> {
    List<Frontdesk> findByStatus(BookingStatus status);
    List<Frontdesk> findByRoomNumber(String roomNumber);
    Optional<Frontdesk> findByRoomNumberAndStatus(String roomNumber, BookingStatus status);
    List<Frontdesk> findByGuestNameContainingIgnoreCase(String guestName);
    List<Frontdesk> findByGuestEmail(String guestEmail);
    List<Frontdesk> findByPaymentStatus(PaymentStatus paymentStatus);
    
    @Query("SELECT f FROM Frontdesk f WHERE f.expectedCheckIn BETWEEN :startDate AND :endDate")
    List<Frontdesk> findByExpectedCheckInBetween(@Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    // ... more custom queries
}
```

### 3. Service Layer

#### FrontdeskService Interface & Implementation
- **Interface**: `src/main/java/com/example/hotel_inventory/service/FrontdeskService.java`
- **Implementation**: `src/main/java/com/example/hotel_inventory/service/impl/FrontdeskServiceImpl.java`

**Key Methods**:
- `getAllBookings()`: Retrieve all bookings
- `getBookingById(Long id)`: Get booking by ID
- `createBooking(CreateFrontdeskRequest request)`: Create new booking
- `updateBooking(Long id, UpdateFrontdeskRequest request)`: Update booking
- `deleteBooking(Long id)`: Delete booking

### 4. Controller Layer

#### FrontdeskController (`src/main/java/com/example/hotel_inventory/controller/FrontdeskController.java`)

**API Endpoints**:
```
GET    /api/frontdesk           - Get all bookings
GET    /api/frontdesk/{id}      - Get booking by ID
POST   /api/frontdesk           - Create new booking
PUT    /api/frontdesk/{id}      - Update booking
DELETE /api/frontdesk/{id}      - Delete booking
POST   /api/frontdesk/{id}/checkin  - Check in guest
POST   /api/frontdesk/{id}/checkout - Check out guest
```

### 5. DTOs

#### Request DTOs
- `CreateFrontdeskRequest`: For creating new bookings
- `UpdateFrontdeskRequest`: For updating existing bookings

#### Response DTOs
- `FrontdeskDto`: Data transfer object for frontdesk entity
- `ApiResponse<T>`: Standardized API response wrapper

## Frontend Implementation

### 1. Project Structure
```
frontdesk-service/
├── src/
│   ├── components/
│   │   ├── BookingList.tsx      # Main booking list component
│   │   └── BookingForm.tsx      # Create/edit booking form
│   ├── services/
│   │   └── frontdeskService.ts  # API service layer
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### 2. Key Components

#### BookingList Component
- Displays all bookings in a responsive table
- Provides action buttons for check-in, check-out, edit, and delete
- Implements loading and error states
- Real-time status updates with color-coded badges

#### BookingForm Component
- Modal-based form for creating and editing bookings
- Form validation with TypeScript
- Supports all booking fields including guest details, room information, and payment status

#### API Service Layer
- Centralized HTTP client for backend communication
- Implements all CRUD operations
- Error handling and response processing

### 3. Features

#### Booking Management
- ✅ Create new bookings
- ✅ View all bookings in a table format
- ✅ Edit existing bookings
- ✅ Delete bookings with confirmation
- ✅ Search and filter capabilities

#### Guest Operations
- ✅ Guest check-in with one-click
- ✅ Guest check-out with one-click
- ✅ Status tracking (Reserved, Checked In, Checked Out, etc.)
- ✅ Guest information management

#### Room Management
- ✅ Room assignment
- ✅ Room type selection
- ✅ Occupancy tracking

#### Payment Tracking
- ✅ Payment status monitoring
- ✅ Amount tracking
- ✅ Payment status updates

## Database Schema

### Frontdesk Table
```sql
CREATE TABLE frontdesk (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(255),
    room_number VARCHAR(255) NOT NULL,
    room_type VARCHAR(255),
    status ENUM('RESERVED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW') NOT NULL,
    check_in_date DATETIME,
    check_out_date DATETIME,
    expected_check_in DATETIME,
    expected_check_out DATETIME,
    number_of_guests INT,
    special_requests TEXT,
    total_amount DECIMAL(10,2),
    payment_status ENUM('PENDING', 'PARTIAL', 'PAID', 'REFUNDED'),
    created_by VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);
```

## Running the Application

### Backend
```bash
cd "D:\office works\Backend"
./mvnw spring-boot:run
```
The backend will be available at `http://localhost:8082`

### Frontend
```bash
cd "D:\office works\frontend\micro-frontend\frontdesk-service"
npm install
npm run dev
```
The frontend will be available at `http://localhost:3003`

### API Documentation
Once the backend is running, API documentation is available at:
- Swagger UI: `http://localhost:8082/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8082/v3/api-docs`

## Integration Points

### CORS Configuration
The backend is configured to accept requests from the frontend origins:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`
- `http://localhost:3003`

### Database Configuration
The service uses the existing MySQL database configuration:
- Database: `hotel_inventory`
- Connection: `jdbc:mysql://localhost:3306/hotel_inventory`

## Testing

### Backend Testing
```bash
cd "D:\office works\Backend"
./mvnw test
```

### Frontend Testing
```bash
cd "D:\office works\frontend\micro-frontend\frontdesk-service"
npm test
```

## Deployment

### Frontend Build
```bash
cd "D:\office works\frontend\micro-frontend\frontdesk-service"
npm run build
```

### Backend Build
```bash
cd "D:\office works\Backend"
./mvnw clean package
```

## Future Enhancements

1. **Authentication & Authorization**
   - User login/logout
   - Role-based access control
   - JWT token management

2. **Real-time Updates**
   - WebSocket integration
   - Live booking status updates

3. **Reporting**
   - Occupancy reports
   - Revenue tracking
   - Guest analytics

4. **Mobile Responsiveness** 
   - Enhanced mobile UI
   - Touch-friendly interactions

5. **Integration**
   - Payment gateway integration
   - Email notifications
   - SMS alerts

## Conclusion

The Frontdesk Service is now fully implemented with:
- ✅ Complete backend API with all CRUD operations
- ✅ Responsive React frontend with modern UI
- ✅ Real-time check-in/check-out functionality
- ✅ Comprehensive booking management
- ✅ Integration with existing hotel inventory system
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for modern styling
- ✅ Error handling and validation
- ✅ API documentation with Swagger

The service follows the existing project patterns and integrates seamlessly with the current hotel inventory management system.
