# Hotel Inventory Database Setup

## Option 1: Manual Setup (Recommended if MySQL command line is not available)

### Step 1: Install MySQL (if not already installed)
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Install MySQL Server with default settings
3. Remember the root password you set during installation

### Step 2: Access MySQL
1. Open MySQL Workbench (comes with MySQL installation)
2. OR use any MySQL client (phpMyAdmin, DBeaver, etc.)
3. OR use MySQL Command Line Client

### Step 3: Create Database and Tables
1. Open the `schema.sql` file in this directory
2. Copy the entire content
3. Execute it in your MySQL client

The script will:
- Create the `hotel_inventory` database
- Create all 9 required tables with proper relationships
- Insert sample data (4 users, 5 categories, 3 suppliers, 6 inventory items, 3 reservations)

## Option 2: Command Line Setup (if MySQL is in PATH)

Run the batch script:
```cmd
cd "D:\office works\Backend\database"
.\setup-database.bat
```

## Verify Database Creation

After running the setup, verify your database by checking:

### Tables Created:
1. `users` - System users with different roles
2. `categories` - Product categories
3. `suppliers` - Supplier information
4. `inventory_items` - Hotel inventory items
5. `frontdesk` - Hotel reservations and check-ins
6. `inspections` - Room/area inspections
7. `inspection_items` - Items checked during inspections
8. `item_requests` - Requests for inventory items
9. `stock_transactions` - Inventory movement tracking

### Sample Data:
- **Users**: 4 users (admin, frontdesk, stockmanager, inspector)
- **Categories**: 5 categories (Bathroom Supplies, Kitchen Supplies, etc.)
- **Suppliers**: 3 suppliers with contact information
- **Inventory Items**: 6 sample items with different stock levels
- **Frontdesk**: 3 sample hotel reservations

## Default Login Credentials

All passwords are: `password`

- **Admin**: admin@hotel.com
- **Front Desk**: frontdesk@hotel.com  
- **Stock Manager**: stock@hotel.com
- **Inspector**: inspector@hotel.com

## Database Configuration

Your Spring Boot application is already configured to use:
- **Database**: hotel_inventory
- **Host**: localhost:3306
- **Username**: root
- **Password**: (empty - update if you have a password)

Update `application.properties` if you have a different MySQL setup:
```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

## Test Connection

After setting up the database, start your Spring Boot application:
```cmd
cd "D:\office works\Backend"
mvn spring-boot:run
```

If successful, you should see:
- Application starts on port 8082
- No database connection errors
- API endpoints available at http://localhost:8082/api/*
- Swagger UI at http://localhost:8082/swagger-ui.html

## Troubleshooting

### Connection Issues:
1. Ensure MySQL server is running
2. Check username/password in application.properties
3. Verify database name is `hotel_inventory`
4. Check firewall settings for port 3306

### Missing Tables:
1. Re-run the schema.sql script
2. Check for any SQL errors in the MySQL client
3. Verify user permissions to create databases/tables

### Data Issues:
1. Check if sample data was inserted properly
2. Verify foreign key relationships are working
3. Test with simple SELECT queries
