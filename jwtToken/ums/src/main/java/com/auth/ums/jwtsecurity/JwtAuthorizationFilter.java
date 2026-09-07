package com.auth.ums.jwtsecurity;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

        private final JwtUtil jwtUtil;
        private static final Logger log = LoggerFactory.getLogger(JwtAuthorizationFilter.class);

        private final ObjectMapper objectMapper = new ObjectMapper();

        public JwtAuthorizationFilter(JwtUtil jwtUtil) {
                this.jwtUtil = jwtUtil;
        }

        @Override
        protected boolean shouldNotFilter(HttpServletRequest request) {

                String path = request.getServletPath();

                return path.startsWith("/api/v1/auth")
                                || path.startsWith("/api/v1/otp")
                                || path.startsWith("/swagger")
                                || path.startsWith("/v3/api-docs")
                                || path.startsWith("/swagger-ui")
                                || path.startsWith("/swagger-ui.html")
                                || path.startsWith("/api/v1/company/add")
                                || path.startsWith("/api/v1/profile-picture/view");
        }

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain) throws ServletException, IOException {

                String header = request.getHeader("Authorization");

                log.info("Authorization : {}", header);

                // TOKEN NULL OR EMPTY
                if (header == null || header.isEmpty() || !header.startsWith("Bearer ")) {

                        sendErrorResponse(
                                        response,
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "NOT_AUTHENTICATED",
                                        "Authentication required. Please log in.");

                        return;
                }

                String token = header.substring(7);

                // TOKEN EXPIRED OR INVALID
                if (!jwtUtil.validateToken(token)) {

                        sendErrorResponse(
                                        response,
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "INVALID_TOKEN",
                                        "Your session has expired. Please log in again.");

                        return;
                }

                String username = jwtUtil.getUsername(token);

                List<String> roles = jwtUtil.getRoles(token);

                // ROLE NULL OR EMPTY
                // if (roles == null || roles.isEmpty()) {

                // sendErrorResponse(
                // response,
                // HttpServletResponse.SC_FORBIDDEN,
                // "NOT_AUTHORIZED",
                // "You do not have permission to access this resource."
                // );

                // return;
                // }

                List<SimpleGrantedAuthority> authorities = roles.stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                                .toList();

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                authorities);

                SecurityContextHolder.getContext()
                                .setAuthentication(authentication);

                log.info("Authenticated User : {}", username);
                log.info("Authorities : {}", authorities);

                filterChain.doFilter(request, response);
        }

        private void sendErrorResponse(
                        HttpServletResponse response,
                        int status,
                        String code,
                        String message) throws IOException {

                response.setStatus(status);
                response.setContentType("application/json");

                ErrorResponse error = new ErrorResponse(code, message);

                response.getWriter()
                                .write(objectMapper.writeValueAsString(error));
        }

        record ErrorResponse(
                        String code,
                        String message) {
        }
}
