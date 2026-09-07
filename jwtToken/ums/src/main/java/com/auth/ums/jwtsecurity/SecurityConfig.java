package com.auth.ums.jwtsecurity;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration
public class SecurityConfig {

    private final JwtAuthorizationFilter jwtAuthorizationFilter;

    public SecurityConfig(JwtAuthorizationFilter jwtAuthorizationFilter) {
        this.jwtAuthorizationFilter = jwtAuthorizationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})               
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                                /* ================== CHANGE ENDPOINTS ================== */

                              // Swagger & OpenAPI Access
                                .requestMatchers("/v3/api-docs/**").permitAll()
                                .requestMatchers("/swagger-ui/**").permitAll()
                        .       requestMatchers("/swagger-ui.html").permitAll()

                               // .requestMatchers("/**").permitAll()
                                .requestMatchers("/api/v1/auth/**").permitAll()

                                //.requestMatchers("/admin/**").hasRole("ADMIN")

                                //********Role controller start *********///
                               // .requestMatchers("/api/v1/role/get-all").hasRole("ADMIN")
                                //.requestMatchers("/api/v1/role/get-all").hasRole("GUEST")
                                .requestMatchers("/api/v1/role/get-all").hasAnyRole("ADMIN", "CUSTOMER","COMPANY_ADMIN")

                                //********Role controller end *********///

                                .requestMatchers("/api/v1/user-role/**").hasRole("ADMIN")
                                .requestMatchers("/api/v1/user/**").hasAnyRole("ADMIN","COMPANY_ADMIN")
                                .requestMatchers("/api/v1/profile/**").hasAnyRole("ADMIN", "CUSTOMER","COMPANY_ADMIN")
                                .requestMatchers("/api/v1/profile-picture/view/**").permitAll()
                                .requestMatchers("/api/v1/profile-picture/**").hasAnyRole("ADMIN", "CUSTOMER","COMPANY_ADMIN")
                                .requestMatchers("/api/v1/profile", "/api/v1/profile/**").hasAnyRole("ADMIN", "CUSTOMER","COMPANY_ADMIN")
                                .requestMatchers("/api/v1/company/add").permitAll()
                                .requestMatchers("/api/v1/company/**").hasAnyRole("ADMIN", "CUSTOMER","COMPANY_ADMIN")
                                .requestMatchers("/api/v1/document/**").hasAnyRole("ADMIN", "CUSTOMER","COMPANY_ADMIN")
                                .requestMatchers("/api/v1/notification/**").hasAnyRole("ADMIN", "CUSTOMER","COMPANY_ADMIN")
                                .requestMatchers("/api/v1/dashboard/**").hasAnyRole("ADMIN", "CUSTOMER","COMPANY_ADMIN")
                                .anyRequest().authenticated()

                        /* ====================================================== */
                )
                .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}