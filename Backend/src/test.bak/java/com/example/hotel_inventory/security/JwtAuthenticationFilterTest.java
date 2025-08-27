package test.java.com.example.hotel_inventory.security;

import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.model.UserRole;
import com.example.hotel_inventory.repository.UserRepository;
import com.example.hotel_inventory.security.JwtUtil;
import com.example.hotel_inventory.security.JwtAuthenticationFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtAuthenticationFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private User testUser;
    private String testToken;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedPassword");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setRole(User.UserRole.ADMIN);
        testUser.setActive(true);

        testToken = "test.jwt.token";
    }

    @Test
    void shouldAuthenticateWithValidToken() throws Exception {
        // Arrange
        Cookie[] cookies = new Cookie[]{new Cookie("auth-token", testToken)};
        when(request.getCookies()).thenReturn(cookies);
        when(jwtUtil.validateToken(testToken)).thenReturn(true);
        when(jwtUtil.getEmailFromToken(testToken)).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("test@example.com", SecurityContextHolder.getContext().getAuthentication().getName());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void shouldNotAuthenticateWithInvalidToken() throws Exception {
        // Arrange
        Cookie[] cookies = new Cookie[]{new Cookie("auth-token", testToken)};
        when(request.getCookies()).thenReturn(cookies);
        when(jwtUtil.validateToken(testToken)).thenReturn(false);

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void shouldNotAuthenticateWithoutToken() throws Exception {
        // Arrange
        when(request.getCookies()).thenReturn(null);

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void shouldNotAuthenticateInactiveUser() throws Exception {
        // Arrange
        testUser.setActive(false);
        Cookie[] cookies = new Cookie[]{new Cookie("auth-token", testToken)};
        when(request.getCookies()).thenReturn(cookies);
        when(jwtUtil.validateToken(testToken)).thenReturn(true);
        when(jwtUtil.getEmailFromToken(testToken)).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }
}
