package com.example.hotel_inventory.config;

import com.example.hotel_inventory.model.*;
import com.example.hotel_inventory.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final UserRepository userRepository;
    private final FrontdeskRepository frontdeskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing sample data...");
        
        // Check if data already exists
        if (categoryRepository.count() > 0) {
            log.info("Sample data already exists, skipping initialization");
            return;
        }
        
        // Create sample users first
        createUsers();
        
        // Create sample categories
        List<Category> categories = Arrays.asList(
            Category.builder().name("Bathroom Supplies").description("Toiletries and bathroom essentials").build(),
            Category.builder().name("Kitchen Supplies").description("Kitchen equipment and utensils").build(),
            Category.builder().name("Cleaning Supplies").description("Cleaning products and equipment").build(),
            Category.builder().name("Bedding").description("Bed sheets, pillows, and blankets").build(),
            Category.builder().name("Electronics").description("Electronic devices and accessories").build()
        );
        
        categories = categoryRepository.saveAll(categories);
        log.info("Created {} categories", categories.size());

        // Create sample suppliers
        List<Supplier> suppliers = Arrays.asList(
            Supplier.builder()
                .name("Hotel Supply Co.")
                .description("Premium hotel supplies and equipment")
                .contactPerson("John Smith")
                .phoneNumber("+1-555-0123")
                .email("john@hotelsupply.com")
                .address("123 Supply Street, New York, NY 10001")
                .build(),
            Supplier.builder()
                .name("Quality Linens Inc.")
                .description("High-quality bedding and linens")
                .contactPerson("Sarah Johnson")
                .phoneNumber("+1-555-0456")
                .email("sarah@qualitylinens.com")
                .address("456 Linen Avenue, Los Angeles, CA 90210")
                .build(),
            Supplier.builder()
                .name("CleanPro Solutions")
                .description("Professional cleaning supplies")
                .contactPerson("Mike Wilson")
                .phoneNumber("+1-555-0789")
                .email("mike@cleanpro.com")
                .address("789 Clean Street, Chicago, IL 60601")
                .build()
        );
        
        suppliers = supplierRepository.saveAll(suppliers);
        log.info("Created {} suppliers", suppliers.size());

        // Create sample inventory items
        List<InventoryItem> items = Arrays.asList(
            InventoryItem.builder()
                .name("Premium Towels")
                .description("High-quality cotton towels")
                .category(categories.get(0))
                .quantity(150)
                .price(new BigDecimal("25.99"))
                .minQuantity(20)
                .maxQuantity(200)
                .supplier(suppliers.get(1))
                .build(),
            InventoryItem.builder()
                .name("Coffee Maker")
                .description("Commercial coffee maker for guest rooms")
                .category(categories.get(1))
                .quantity(25)
                .price(new BigDecimal("89.99"))
                .minQuantity(5)
                .maxQuantity(50)
                .supplier(suppliers.get(0))
                .build(),
            InventoryItem.builder()
                .name("All-Purpose Cleaner")
                .description("Eco-friendly cleaning solution")
                .category(categories.get(2))
                .quantity(75)
                .price(new BigDecimal("12.50"))
                .minQuantity(10)
                .maxQuantity(100)
                .supplier(suppliers.get(2))
                .build(),
            InventoryItem.builder()
                .name("Queen Size Sheets")
                .description("100% cotton queen size bed sheets")
                .category(categories.get(3))
                .quantity(80)
                .price(new BigDecimal("45.00"))
                .minQuantity(15)
                .maxQuantity(120)
                .supplier(suppliers.get(1))
                .build(),
            InventoryItem.builder()
                .name("TV Remote Control")
                .description("Universal TV remote for guest rooms")
                .category(categories.get(4))
                .quantity(5)
                .price(new BigDecimal("15.99"))
                .minQuantity(10)
                .maxQuantity(50)
                .supplier(suppliers.get(0))
                .build(),
            InventoryItem.builder()
                .name("Shampoo Dispenser")
                .description("Wall-mounted shampoo dispenser")
                .category(categories.get(0))
                .quantity(0)
                .price(new BigDecimal("35.00"))
                .minQuantity(5)
                .maxQuantity(30)
                .supplier(suppliers.get(0))
                .build()
        );
        
        items = inventoryItemRepository.saveAll(items);
        log.info("Created {} inventory items", items.size());
        
        // Create sample frontdesk data
        createFrontdeskData();
        
        log.info("Sample data initialization completed successfully!");
    }
    
    private void createUsers() {
        List<User> users = Arrays.asList(
            User.builder()
                .username("admin")
                .email("admin@hotel.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("System")
                .lastName("Administrator")
                .role(User.UserRole.ADMIN)
                .isActive(true)
                .build(),
            User.builder()
                .username("frontdesk")
                .email("frontdesk@hotel.com")
                .password(passwordEncoder.encode("front123"))
                .firstName("Front")
                .lastName("Desk")
                .role(User.UserRole.FRONT_DESK)
                .isActive(true)
                .build(),
            User.builder()
                .username("stockmanager")
                .email("stock@hotel.com")
                .password(passwordEncoder.encode("stock123"))
                .firstName("Stock")
                .lastName("Manager")
                .role(User.UserRole.STOCK_MANAGER)
                .isActive(true)
                .build(),
            User.builder()
                .username("inspector")
                .email("inspector@hotel.com")
                .password(passwordEncoder.encode("inspect123"))
                .firstName("Room")
                .lastName("Inspector")
                .role(User.UserRole.INSPECTOR)
                .isActive(true)
                .build()
        );
        
        users = userRepository.saveAll(users);
        log.info("Created {} users", users.size());
    }
    
    private void createFrontdeskData() {
        List<Frontdesk> reservations = Arrays.asList(
            Frontdesk.builder()
                .guestName("Alice Johnson")
                .guestEmail("alice@email.com")
                .guestPhone("+1-555-1001")
                .roomNumber("101")
                .roomType("Standard")
                .numberOfGuests(2)
                .expectedCheckIn(LocalDateTime.now().plusDays(1))
                .expectedCheckOut(LocalDateTime.now().plusDays(4))
                .totalAmount(450.00)
                .paymentStatus(Frontdesk.PaymentStatus.PAID)
                .status(Frontdesk.BookingStatus.RESERVED)
                .createdBy("frontdesk")
                .build(),
            Frontdesk.builder()
                .guestName("Bob Smith")
                .guestEmail("bob@email.com")
                .guestPhone("+1-555-1002")
                .roomNumber("205")
                .roomType("Deluxe")
                .numberOfGuests(1)
                .expectedCheckIn(LocalDateTime.now().plusDays(2))
                .expectedCheckOut(LocalDateTime.now().plusDays(6))
                .totalAmount(600.00)
                .paymentStatus(Frontdesk.PaymentStatus.PENDING)
                .status(Frontdesk.BookingStatus.RESERVED)
                .createdBy("frontdesk")
                .build(),
            Frontdesk.builder()
                .guestName("Carol Davis")
                .guestEmail("carol@email.com")
                .guestPhone("+1-555-1003")
                .roomNumber("301")
                .roomType("Suite")
                .numberOfGuests(4)
                .expectedCheckIn(LocalDateTime.now().minusDays(1))
                .expectedCheckOut(LocalDateTime.now().plusDays(2))
                .checkInDate(LocalDateTime.now().minusDays(1))
                .totalAmount(800.00)
                .paymentStatus(Frontdesk.PaymentStatus.PAID)
                .status(Frontdesk.BookingStatus.CHECKED_IN)
                .createdBy("frontdesk")
                .build()
        );
        
        reservations = frontdeskRepository.saveAll(reservations);
        log.info("Created {} frontdesk reservations", reservations.size());
    }
}
