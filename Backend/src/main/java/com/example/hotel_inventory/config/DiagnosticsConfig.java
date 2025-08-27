package com.example.hotel_inventory.config;

import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class DiagnosticsConfig {

    @Bean
    CommandLineRunner logInspectionTableColumns(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                String schema = jdbcTemplate.queryForObject("select database()", String.class);
                List<String> colsV2 = jdbcTemplate.queryForList(
                        "select column_name from information_schema.columns where table_schema = ? and table_name = 'inspections_v2' order by ordinal_position",
                        String.class, schema);
                if (colsV2.isEmpty()) {
                    log.warn("[Diagnostics] Table 'inspections_v2' not found in schema '{}'.", schema);
                } else {
                    log.info("[Diagnostics] inspections_v2 columns: {}", colsV2);
                }
                List<String> itemColsV2 = jdbcTemplate.queryForList(
                        "select column_name from information_schema.columns where table_schema = ? and table_name = 'inspection_items_v2' order by ordinal_position",
                        String.class, schema);
                if (itemColsV2.isEmpty()) {
                    log.warn("[Diagnostics] Table 'inspection_items_v2' not found in schema '{}'.", schema);
                } else {
                    log.info("[Diagnostics] inspection_items_v2 columns: {}", itemColsV2);
                }
            } catch (Exception e) {
                log.error("[Diagnostics] Failed to inspect 'inspections' table: {}", e.getMessage());
            }
        }; 
    }
}
