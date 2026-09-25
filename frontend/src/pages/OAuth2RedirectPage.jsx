import React, { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Container, CssBaseline, ThemeProvider, Typography, createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF4D4D' },
    background: { default: '#0A0A0A', paper: '#1A1A1A' },
  },
  typography: { fontFamily: '"Outfit", "Inter", sans-serif' },
});

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
    const payload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((character) => {
          const hex = (character.codePointAt(0) ?? 0).toString(16).padStart(2, '0');
          return `%${hex}`;
        })
        .join('')
    );

    return JSON.parse(payload);
  } catch {
    return {};
  }
};

function OAuth2RedirectPage() {
  const navigate = useNavigate();
  const [error] = useState("");

  useEffect(() => {
    // The backend now securely sets an HttpOnly cookie for the JWT.
    // There is no longer a token appended to the URL to parse.
    
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        username: "Google User", // Provide a fallback name since we can't parse the JWT locally
        role: "CUSTOMER",
      })
    );

    // Redirect to restaurants page, where authenticated requests will now use the HttpOnly cookie
    navigate("/restaurants", { replace: true });
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 20% 20%, #1a0a0a 0%, #0a0a0a 100%)' }}>
        <Container maxWidth="sm">
          <Box sx={{ p: 5, borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(26,26,26,0.92)', textAlign: 'center' }}>
            {error ? (
              <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
                {error}
              </Alert>
            ) : (
              <CircularProgress color="primary" sx={{ mb: 3 }} />
            )}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Completing Google sign-in
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we finish logging you in.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default OAuth2RedirectPage;