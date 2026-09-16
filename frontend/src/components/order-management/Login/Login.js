import see from "./see.jpg";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import profileIcon from "./profile.png";
import passwordIcon from "./password.png";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8083/api/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store the token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/delivery-dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const commonTextFieldStyles = {
    "& .MuiInputBase-input": {
      color: "#fff",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "1px solid white",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "1px solid #00B8D4",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "2px solid #00B8D4",
    },
    "& .MuiInputLabel-root": {
      color: "#ddd",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#00B8D4",
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${see})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            color: "#00B8D4",
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "26px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            textShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Log In to Your Account
        </h2>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <img
              src={profileIcon}
              alt="email"
              style={{ width: 24, height: 24, marginRight: 10 }}
            />
            <TextField
              id="email"
              label="Email"
              variant="standard"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={commonTextFieldStyles}
              required
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
            <img
              src={passwordIcon}
              alt="password"
              style={{ width: 24, height: 24, marginRight: 10 }}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="standard"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={commonTextFieldStyles}
              required
            />
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{
              backgroundColor: "#00B8D4",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(0, 184, 212, 0.5)",
              fontSize: "16px",
              transition: "0.3s",
            }}
            disabled={loading}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#0097A7";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#00B8D4";
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ color: "#fff", fontSize: "14px" }}>
            Don't have an account?{" "}
            <a
              href="/order-register"
              style={{ color: "#00E5FF", textDecoration: "underline" }}
            >
              Register
            </a>
          </p>
          <p style={{ marginTop: "10px" }}>
            <a
              href="/forgot-password"
              style={{
                color: "#FF8A65",
                fontSize: "14px",
                textDecoration: "underline",
              }}
            >
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;