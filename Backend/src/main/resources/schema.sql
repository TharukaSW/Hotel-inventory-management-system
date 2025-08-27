-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist
DROP TABLE IF EXISTS inspection_items_v2;
DROP TABLE IF EXISTS inspections_v2;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS frontdesk;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Create Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role ENUM('ADMIN', 'FRONT_DESK', 'STOCK_MANAGER', 'INSPECTOR') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    supply_item VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Suppliers table
CREATE TABLE suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(255),
    address TEXT,
    supply_item VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Inventory Items table
CREATE TABLE inventory_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    supplier_id BIGINT,
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10,2),
    status ENUM('IN_STOCK','LOW_STOCK','OUT_OF_STOCK','DISCONTINUED') DEFAULT 'IN_STOCK',
    min_quantity INTEGER DEFAULT 10,
    max_quantity INTEGER DEFAULT 1000,
    unit_of_measurement VARCHAR(255),
    expiry_date TIMESTAMP NULL,
    condition_status VARCHAR(255),
    warranty_expiry TIMESTAMP NULL,
    created_by BIGINT NULL,
    updated_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Create Frontdesks table
CREATE TABLE frontdesk (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(255),
    room_number VARCHAR(50),
    room_type VARCHAR(100),
    status ENUM('RESERVED','CHECKED_IN','CHECKED_OUT','CANCELLED','NO_SHOW') DEFAULT 'RESERVED',
    check_in_date TIMESTAMP NULL,
    check_out_date TIMESTAMP NULL,
    expected_check_in TIMESTAMP NULL,
    expected_check_out TIMESTAMP NULL,
    number_of_guests INTEGER,
    special_requests TEXT,
    total_amount DECIMAL(10,2),
    payment_status ENUM('PENDING','PARTIAL','PAID','REFUNDED') DEFAULT 'PENDING',
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create new versioned Inspections table
CREATE TABLE inspections_v2 (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inspector_id BIGINT NOT NULL,
    location_type VARCHAR(255) NOT NULL,
    location_identifier VARCHAR(255) NOT NULL,
    status ENUM('IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'IN_PROGRESS',
    notes VARCHAR(1000),
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inspector_id) REFERENCES users(id)
);

-- Create new versioned Inspection Items table
CREATE TABLE inspection_items_v2 (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inspection_id BIGINT NOT NULL,
    inventory_item_id BIGINT NOT NULL,
    expected_quantity INTEGER,
    actual_quantity INTEGER,
    condition_status VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id),
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id)
);
