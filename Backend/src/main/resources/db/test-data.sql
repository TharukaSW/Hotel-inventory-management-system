-- Insert test user with BCrypt hashed password (password: Test@123)
INSERT INTO users (id, email, username, password, first_name, last_name, role, is_active)
VALUES (
    1,
    'testuser@hotel.com', 
    'testuser',
    '$2a$10$KcVxDQvt3zdFPgE3EG8y6OKgqwZ1MbqGrvWXqtFtQwjJ0UVlGqYu2',
    'Test', 
    'User', 
    'ADMIN', 
    true
);

-- Insert sample categories (matching the table structure)
INSERT INTO categories (id, name, description, is_active) VALUES 
(1, 'Room Supplies', 'Supplies needed for guest rooms', true),
(2, 'Cleaning', 'Cleaning supplies and equipment', true),
(3, 'Kitchen', 'Kitchen and dining supplies', true);

-- Insert sample suppliers (matching the table structure: phone_number not phone)
INSERT INTO suppliers (id, name, contact_person, email, phone_number, address, is_active) VALUES 
(1, 'Hotel Supply Co', 'John Doe', 'john@hotelsupply.com', '123-456-7890', '123 Supply St', true),
(2, 'Clean Solutions Ltd', 'Jane Smith', 'jane@cleansolutions.com', '123-456-7891', '456 Clean Ave', true);

-- Insert sample inventory items (matching the table structure: price not unit_price)
INSERT INTO inventory_items (id, name, description, category_id, supplier_id, quantity, min_quantity, price, status) VALUES 
(1, 'Towels', 'Hotel bath towels', 1, 1, 50, 10, 15.99, 'IN_STOCK'),
(2, 'Bed Sheets', 'Queen size bed sheets', 1, 1, 30, 5, 25.99, 'IN_STOCK'),
(3, 'All-Purpose Cleaner', 'Multi-surface cleaner', 2, 2, 20, 5, 8.99, 'IN_STOCK');
