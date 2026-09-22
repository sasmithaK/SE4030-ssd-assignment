import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Snackbar
} from '@mui/material';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF4D4D' },
    background: { default: '#0A0A0A', paper: '#1A1A1A' },
  },
  typography: { fontFamily: '"Outfit", "Inter", sans-serif' },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.03)',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const navigateBasedOnRole = (role) => {
    const normalizedRole = role?.toUpperCase();
    if (normalizedRole === "CUSTOMER") navigate("/restaurants_user", { replace: true });
    else if (normalizedRole === "RESTAURANT_ADMIN") navigate("/restaurants", { replace: true });
    else if (normalizedRole === "DELIVERY_PERSON") navigate("/delivery-dashboard", { replace: true });
    else navigate("/", { replace: true });
  };

  const handleGoogleSignIn = () => {
    const backendBaseUrl = process.env.REACT_APP_RESTAURANT_AUTH_URL || "http://localhost:8082";
    window.location.href = `${backendBaseUrl}/oauth2/authorization/google`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.status === 200) {
        const user = response.data;
        localStorage.setItem("currentUser", JSON.stringify(user));
        if (rememberMe) localStorage.setItem("rememberedEmail", email);
        else localStorage.removeItem("rememberedEmail");

        setSuccess(true);
        setTimeout(() => navigateBasedOnRole(user.role), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at 20% 20%, #1a0a0a 0%, #0a0a0a 100%)'
      }}>
        <Container maxWidth="sm">
          <Card sx={{
            borderRadius: 6,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.05)',
            overflow: 'visible'
          }}>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{
                  fontWeight: 800,
                  mb: 1,
                  background: 'linear-gradient(45deg, #FF4D4D, #FFB347)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your restaurant ecosystem effortlessly.
                </Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@gourmetgo.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} color="#666" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} color="#666" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center',
                  mt: 2, mb: 3
                }}>
                  <FormControlLabel
                    control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                    label="Remember me"
                    sx={{ flexGrow: 1 }}
                  />
                  <Link href="/forgot-password" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 500 }}>
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading || success}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    boxShadow: '0 10px 20px rgba(255,77,77,0.3)',
                    '&:hover': { boxShadow: '0 15px 25px rgba(255,77,77,0.4)' }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : (success ? "Success!" : "Sign In")}
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.12)' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    or continue with
                  </Typography>
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.12)' }} />
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  type="button"
                  onClick={handleGoogleSignIn}
                  sx={{
                    py: 2,
                    fontSize: '1rem',
                    borderColor: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.35)',
                      backgroundColor: 'rgba(255,255,255,0.06)'
                    }
                  }}
                  startIcon={
                    <Box sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #4285F4 0%, #EA4335 33%, #FBBC05 66%, #34A853 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 12,
                      lineHeight: 1
                    }}>
                      G
                    </Box>
                  }
                >
                  Continue with Google
                </Button>
              </form>

              <Typography variant="body2" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                Don't have an account? {" "}
                <Link href="/signup" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>
                  Create one now
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Snackbar open={success} autoHideDuration={2000}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default LoginPage;
