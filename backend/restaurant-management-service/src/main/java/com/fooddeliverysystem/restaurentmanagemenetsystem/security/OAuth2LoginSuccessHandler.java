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
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    @Value("${app.frontend.oauth-redirect}")
    private String frontendOAuthRedirectUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Get the user's email from Google
        String email = oAuth2User.getAttribute("email");
        
        // Generate our system JWT token using the helper method we created
        String token = jwtUtils.generateTokenFromOAuth(email);
        
        // Redirect the user back to the React frontend with the token
        String targetUrl = frontendOAuthRedirectUrl + "?token=" + token;
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
