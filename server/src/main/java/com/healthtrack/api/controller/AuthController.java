package com.healthtrack.api.controller;

import com.healthtrack.api.dto.AuthenticationRequest;
import com.healthtrack.api.dto.AuthenticationResponse;
import com.healthtrack.api.dto.RegisterRequest;
import com.healthtrack.api.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;

    @PostMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Pong! Connection established.");
    }

    @GetMapping("/ping")
    public ResponseEntity<String> pingGet() {
        return ResponseEntity.ok("Pong! Connection established (GET).");
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
