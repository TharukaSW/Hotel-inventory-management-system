package com.example.hotel_inventory;

import com.example.hotel_inventory.controller.AdminController;
import com.example.hotel_inventory.model.Category;
import com.example.hotel_inventory.model.InventoryItem;
import com.example.hotel_inventory.model.Supplier;
import com.example.hotel_inventory.service.InventoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AdminControllerTest {

    @Mock
    private InventoryService inventoryService;

    @InjectMocks
    private AdminController adminController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testGetAdminStats() throws Exception {
        // Arrange
        Category category = Category.builder()
                .id(1L)
                .name("Test Category")
                .build();

        Supplier supplier = Supplier.builder()
                .id(1L)
                .name("Test Supplier")
                .build();

        List<InventoryItem> mockItems = Arrays.asList(
                InventoryItem.builder()
                        .id(1L)
                        .name("Test Item 1")
                        .quantity(15)
                        .price(new BigDecimal("10.50"))
                        .category(category)
                        .supplier(supplier)
                        .createdAt(LocalDateTime.now())
                        .build(),
                InventoryItem.builder()
                        .id(2L)
                        .name("Test Item 2")
                        .quantity(5)
                        .price(new BigDecimal("20.00"))
                        .category(category)
                        .supplier(supplier)
                        .createdAt(LocalDateTime.now())
                        .build(),
                InventoryItem.builder()
                        .id(3L)
                        .name("Test Item 3")
                        .quantity(0)
                        .price(new BigDecimal("15.75"))
                        .category(category)
                        .supplier(supplier)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        when(inventoryService.getAllItems()).thenReturn(mockItems);

        // Act & Assert
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalItems").value(3))
                .andExpect(jsonPath("$.lowStockItems").value(1))
                .andExpect(jsonPath("$.outOfStockItems").value(1));
    }

    @Test
    public void testGetLowStockItems() throws Exception {
        // Arrange
        Category category = Category.builder()
                .id(1L)
                .name("Test Category")
                .build();

        Supplier supplier = Supplier.builder()
                .id(1L)
                .name("Test Supplier")
                .build();

        List<InventoryItem> mockItems = Arrays.asList(
                InventoryItem.builder()
                        .id(1L)
                        .name("Low Stock Item")
                        .quantity(5)
                        .price(new BigDecimal("10.00"))
                        .category(category)
                        .supplier(supplier)
                        .build(),
                InventoryItem.builder()
                        .id(2L)
                        .name("Normal Stock Item")
                        .quantity(50)
                        .price(new BigDecimal("20.00"))
                        .category(category)
                        .supplier(supplier)
                        .build()
        );

        when(inventoryService.getAllItems()).thenReturn(mockItems);

        // Act & Assert
        mockMvc.perform(get("/api/admin/inventory/low-stock"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Low Stock Item"));
    }

    @Test
    public void testGetOutOfStockItems() throws Exception {
        // Arrange
        Category category = Category.builder()
                .id(1L)
                .name("Test Category")
                .build();

        Supplier supplier = Supplier.builder()
                .id(1L)
                .name("Test Supplier")
                .build();

        List<InventoryItem> mockItems = Arrays.asList(
                InventoryItem.builder()
                        .id(1L)
                        .name("Out of Stock Item")
                        .quantity(0)
                        .price(new BigDecimal("10.00"))
                        .category(category)
                        .supplier(supplier)
                        .build(),
                InventoryItem.builder()
                        .id(2L)
                        .name("In Stock Item")
                        .quantity(20)
                        .price(new BigDecimal("20.00"))
                        .category(category)
                        .supplier(supplier)
                        .build()
        );

        when(inventoryService.getAllItems()).thenReturn(mockItems);

        // Act & Assert
        mockMvc.perform(get("/api/admin/inventory/out-of-stock"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Out of Stock Item"));
    }
}
