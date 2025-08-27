package test.java.com.example.hotel_inventory.security;

import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.model.UserRole;
import com.example.hotel_inventory.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", "test_secret_key_that_is_long_enough_for_testing_purposes_256_bits");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpiration", 3600000L); // 1 hour

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setRole(User.UserRole.ADMIN);
    }

    @Test
    void generateTokenShouldIncludeEmail() {
        // Act
        String token = jwtUtil.generateToken(testUser);

        // Assert
        assertNotNull(token);
        assertEquals("test@example.com", jwtUtil.getEmailFromToken(token));
    }

    @Test
    void validateTokenShouldReturnTrueForValidToken() {
        // Arrange
        String token = jwtUtil.generateToken(testUser);

        // Act & Assert
        assertTrue(jwtUtil.validateToken(token));
    }

    @Test
    void validateTokenShouldReturnFalseForInvalidToken() {
        // Act & Assert
        assertFalse(jwtUtil.validateToken("invalid.token.here"));
    }

    @Test
    void tokenShouldContainUserClaims() {
        // Act
        String token = jwtUtil.generateToken(testUser);

        // Assert
        assertEquals(1L, (Long)jwtUtil.getClaimFromToken(token, claims -> claims.get("userId", Long.class)));
        assertEquals("test@example.com", jwtUtil.getClaimFromToken(token, claims -> claims.get("email", String.class)));
        assertEquals("Test", jwtUtil.getClaimFromToken(token, claims -> claims.get("firstName", String.class)));
        assertEquals("User", jwtUtil.getClaimFromToken(token, claims -> claims.get("lastName", String.class)));
        assertEquals("USER", jwtUtil.getClaimFromToken(token, claims -> claims.get("role", String.class)));
    }
}
