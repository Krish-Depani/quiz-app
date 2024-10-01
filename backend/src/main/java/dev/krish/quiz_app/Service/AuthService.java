package dev.krish.quiz_app.Service;

import dev.krish.quiz_app.Controller.LoginRequest;
import dev.krish.quiz_app.Model.User;
import dev.krish.quiz_app.Repository.UserRepository;
import dev.krish.quiz_app.Security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public ResponseEntity<?> register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }

        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", savedUser);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.email());
        String token = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByEmail(loginRequest.email()).orElseThrow();

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }
}