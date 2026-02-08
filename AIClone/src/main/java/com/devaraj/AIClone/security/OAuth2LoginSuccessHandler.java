package com.devaraj.AIClone.security;

import com.devaraj.AIClone.entity.User;
import com.devaraj.AIClone.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Check if user already exists by EMAIL
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            //  Create new user if not found
            user = new User();
            user.setEmail(email);
            
            String baseName = (name != null && !name.isEmpty()) ? name : "Google User";
            String uniqueSuffix = UUID.randomUUID().toString().substring(0, 4);
            user.setUsername(baseName + "_" + uniqueSuffix); 
            
            user.setPassword(UUID.randomUUID().toString());
            userRepository.save(user);
        }

        // Generate Token
        String token = jwtService.generateToken(user.getEmail());

        //  Redirect to Frontend
        getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/login?token=" + token);
    }
}