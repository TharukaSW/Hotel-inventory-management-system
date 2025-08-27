-- Hotel Inventory Management System Database Schema
-- Database: hotel_inventory

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hotel_inventory
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE hotel_inventory;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS stock_transactions;
DROP TABLE IF EXISTS item_requests;
DROP TABLE IF EXISTS inspection_items;
DROP TABLE IF EXISTS inspections;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS frontdesk;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Create Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role ENUM('ADMIN', 'FRONT_DESK', 'INSPECTOR', 'STOCK_MANAGER') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    supply_item VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Suppliers table
CREATE TABLE suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    address VARCHAR(255),
    contact_person VARCHAR(255),
    description VARCHAR(500),
    supply_item VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Inventory Items table
CREATE TABLE inventory_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    quantity INTEGER NOT NULL,
    min_quantity INTEGER,
    max_quantity INTEGER,
    price DECIMAL(10,2) NOT NULL,
    unit_of_measurement VARCHAR(255),
    condition_status VARCHAR(255),
    status ENUM('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED') NOT NULL,
    category_id BIGINT,
    supplier_id BIGINT,
    created_by BIGINT,
    updated_by BIGINT,
    expiry_date TIMESTAMP NULL,
    warranty_expiry TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Create Frontdesk table
CREATE TABLE frontdesk (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(255),
    room_number VARCHAR(255) NOT NULL,
    room_type VARCHAR(255),
    number_of_guests INTEGER,
    expected_check_in TIMESTAMP,
    expected_check_out TIMESTAMP,
    check_in_date TIMESTAMP NULL,
    check_out_date TIMESTAMP NULL,
    total_amount DOUBLE,
    payment_status ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED'),
    status ENUM('RESERVED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW') NOT NULL,
    special_requests TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Inspections table
CREATE TABLE inspections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location_type VARCHAR(255) NOT NULL,
    location_identifier VARCHAR(255) NOT NULL,
    inspector_id BIGINT NOT NULL,
    status ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inspector_id) REFERENCES users(id)
);

-- Create Inspection Items table
CREATE TABLE inspection_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inspection_id BIGINT NOT NULL,
    inventory_item_id BIGINT NOT NULL,
    expected_quantity INTEGER,
    actual_quantity INTEGER,
    condition_status VARCHAR(255),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id)
);

-- Create Item Requests table
CREATE TABLE item_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inventory_item_id BIGINT NOT NULL,
    inspector_id BIGINT NOT NULL,
    location_type VARCHAR(255) NOT NULL,
    location_identifier VARCHAR(255),
    requested_quantity INTEGER NOT NULL,
    reason VARCHAR(500),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    approved_by BIGINT,
    approval_notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (inspector_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Create Stock Transactions table
CREATE TABLE stock_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    type ENUM('ADD', 'REMOVE', 'ADJUSTMENT', 'TRANSFER') NOT NULL,
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER,
    new_quantity INTEGER,
    reason VARCHAR(500),
    performed_by BIGINT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_inventory_items_name ON inventory_items(name);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);
CREATE INDEX idx_inventory_items_category ON inventory_items(category_id);
CREATE INDEX idx_inventory_items_supplier ON inventory_items(supplier_id);
CREATE INDEX idx_frontdesk_room ON frontdesk(room_number);
CREATE INDEX idx_frontdesk_status ON frontdesk(status);
CREATE INDEX idx_inspections_location ON inspections(location_type, location_identifier);
CREATE INDEX idx_inspections_inspector ON inspections(inspector_id);
CREATE INDEX idx_item_requests_status ON item_requests(status);
CREATE INDEX idx_stock_transactions_item ON stock_transactions(item_id);
CREATE INDEX idx_stock_transactions_date ON stock_transactions(transaction_date);

-- Insert initial data
-- Insert default admin user (password will be encoded by Spring Boot)
INSERT INTO users (username, email, password, first_name, last_name, role, is_active) VALUES
('admin', 'admin@hotel.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'System', 'Administrator', 'ADMIN', TRUE),
('frontdesk', 'frontdesk@hotel.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Front', 'Desk', 'FRONT_DESK', TRUE),
('stockmanager', 'stock@hotel.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Stock', 'Manager', 'STOCK_MANAGER', TRUE),
('inspector', 'inspector@hotel.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Room', 'Inspector', 'INSPECTOR', TRUE);

-- Insert sample categories
INSERT INTO categories (name, description, supply_item, is_active) VALUES
('Bathroom Supplies', 'Items required for bathroom maintenance and guest amenities', 'Towels, Toiletries, Cleaning Supplies', TRUE),
('Kitchen Supplies', 'Kitchen equipment and consumables', 'Utensils, Appliances, Food Items', TRUE),
('Cleaning Supplies', 'General cleaning materials and equipment', 'Detergents, Mops, Vacuum Cleaners', TRUE),
('Bedding', 'Bed linens and related items', 'Sheets, Pillows, Blankets', TRUE),
('Electronics', 'Electronic equipment and devices', 'TVs, Phones, WiFi Equipment', TRUE);

-- Insert sample suppliers
INSERT INTO suppliers (name, email, phone_number, address, contact_person, description, supply_item, is_active) VALUES
('Hotel Supply Co.', 'orders@hotelsupply.com', '+1-555-0101', '123 Supply Street, Business District', 'John Smith', 'Premium hotel supply provider', 'General Hotel Supplies', TRUE),
('Quality Linens Inc.', 'sales@qualitylinens.com', '+1-555-0102', '456 Textile Avenue, Industrial Zone', 'Mary Johnson', 'High-quality bedding and linens', 'Bedding and Linens', TRUE),
('CleanPro Solutions', 'contact@cleanpro.com', '+1-555-0103', '789 Clean Street, Service Area', 'Robert Brown', 'Professional cleaning supplies and equipment', 'Cleaning Supplies', TRUE);

-- Insert sample inventory items
INSERT INTO inventory_items (name, description, quantity, min_quantity, max_quantity, price, unit_of_measurement, condition_status, status, category_id, supplier_id, created_by) VALUES
('Bath Towels', 'Premium cotton bath towels for guest rooms', 150, 50, 200, 25.99, 'pieces', 'NEW', 'IN_STOCK', 1, 2, 1),
('Toilet Paper', '3-ply toilet paper rolls', 300, 100, 500, 2.50, 'rolls', 'NEW', 'IN_STOCK', 1, 1, 1),
('Bed Sheets - Queen', 'High thread count queen size bed sheets', 80, 30, 120, 35.00, 'sets', 'NEW', 'IN_STOCK', 4, 2, 1),
('All-Purpose Cleaner', 'Multi-surface cleaning solution', 25, 20, 50, 8.99, 'bottles', 'NEW', 'LOW_STOCK', 3, 3, 1),
('LED TV - 42 inch', 'Smart LED television for guest rooms', 5, 2, 10, 450.00, 'units', 'NEW', 'IN_STOCK', 5, 1, 1),
('Coffee Maker', 'Single-serve coffee makers for rooms', 0, 5, 15, 75.00, 'units', 'NEW', 'OUT_OF_STOCK', 2, 1, 1);

-- Insert sample frontdesk reservations
INSERT INTO frontdesk (guest_name, guest_email, guest_phone, room_number, room_type, number_of_guests, expected_check_in, expected_check_out, total_amount, payment_status, status, created_by) VALUES
('Alice Johnson', 'alice@email.com', '+1-555-1001', '101', 'Standard', 2, '2024-01-15 15:00:00', '2024-01-18 11:00:00', 450.00, 'PAID', 'RESERVED', 'frontdesk'),
('Bob Smith', 'bob@email.com', '+1-555-1002', '205', 'Deluxe', 1, '2024-01-16 16:00:00', '2024-01-20 12:00:00', 600.00, 'PENDING', 'RESERVED', 'frontdesk'),
('Carol Davis', 'carol@email.com', '+1-555-1003', '301', 'Suite', 4, '2024-01-14 14:00:00', '2024-01-17 10:00:00', 800.00, 'PAID', 'CHECKED_IN', 'frontdesk');

COMMIT;

-- Display success message
SELECT 'Hotel Inventory Database Schema Created Successfully!' as message;
SELECT 'Database: hotel_inventory' as database_name;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'hotel_inventory';
