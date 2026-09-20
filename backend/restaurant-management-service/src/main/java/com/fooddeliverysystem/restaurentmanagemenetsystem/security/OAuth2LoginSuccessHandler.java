package com.fooddeliverysystem.restaurentmanagemenetsystem.security;

import com.fooddeliverysystem.common.security.JwtUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Get the user's email from Google
        String email = oAuth2User.getAttribute("email");
        
        // Generate our system JWT token using the helper method we created
        String token = jwtUtils.generateTokenFromOAuth(email);
        
        // Redirect the user back to the React frontend with the token
        String targetUrl = "http://localhost:3000/oauth2/redirect?token=" + token;
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
