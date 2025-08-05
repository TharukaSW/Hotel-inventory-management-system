package com.example.hotel_inventory;

import com.example.hotel_inventory.dto.request.CreateSupplierRequest;
import com.example.hotel_inventory.model.Supplier;
import com.example.hotel_inventory.repository.SupplierRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class SupplierControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateSupplierWithSupplyItem() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        CreateSupplierRequest request = CreateSupplierRequest.builder()
                .name("Test Supplier")
                .email("test@supplier.com")
                .supplyItem("Electronics")
                .phoneNumber("123-456-7890")
                .isActive(true)
                .build();

        mockMvc.perform(post("/api/suppliers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Supplier"))
                .andExpect(jsonPath("$.email").value("test@supplier.com"))
                .andExpect(jsonPath("$.supplyItem").value("Electronics"))
                .andExpect(jsonPath("$.phoneNumber").value("123-456-7890"));
    }

    @Test
    public void testUpdateSupplierWithSupplyItem() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        // First create a supplier
        Supplier supplier = Supplier.builder()
                .name("Original Supplier")
                .email("original@supplier.com")
                .supplyItem("Furniture")
                .isActive(true)
                .build();
        Supplier savedSupplier = supplierRepository.save(supplier);

        // Update the supplier
        CreateSupplierRequest updateRequest = CreateSupplierRequest.builder()
                .name("Updated Supplier")
                .email("updated@supplier.com")
                .supplyItem("Electronics")
                .phoneNumber("987-654-3210")
                .isActive(true)
                .build();

        mockMvc.perform(put("/api/suppliers/" + savedSupplier.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Supplier"))
                .andExpect(jsonPath("$.email").value("updated@supplier.com"))
                .andExpect(jsonPath("$.supplyItem").value("Electronics"))
                .andExpect(jsonPath("$.phoneNumber").value("987-654-3210"));
    }
} 