import React, { useState } from "react";
import see from "./see.jpg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import profileIcon from "./profile.png";
import passwordIcon from "./password.png";
import phone from "./phone.png";
import email from "./email.png";
import location from "./location.png";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate all fields are filled
    for (const key in formData) {
      if (!formData[key].trim()) {
        setError(`Please fill out the ${key === "confirmPassword" ? "Confirm Password" : key.charAt(0).toUpperCase() + key.slice(1)} field.`);
        setIsLoading(false);
        return;
      }
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8083/api/customers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      alert("Registration successful!");
      window.location.href = "/login";
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
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
          maxWidth: "500px",
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
          Join Us and Start Ordering
        </h2>

        {error && (
          <div style={{ color: "red", marginBottom: "20px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Full Name */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img src={profileIcon} alt="full name" style={{ width: 24, height: 24, marginRight: 10 }} />
          <TextField
            name="fullname"
            label="Full Name"
            variant="standard"
            fullWidth
            required
            sx={commonTextFieldStyles}
            value={formData.fullname}
            onChange={handleChange}
          />
        </Box>

        {/* Email */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img src={email} alt="email" style={{ width: 24, height: 24, marginRight: 10 }} />
          <TextField
            name="email"
            label="Email"
            type="email"
            variant="standard"
            fullWidth
            required
            sx={commonTextFieldStyles}
            value={formData.email}
            onChange={handleChange}
          />
        </Box>

        {/* Phone Number */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img src={phone} alt="phone" style={{ width: 24, height: 24, marginRight: 10 }} />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            variant="standard"
            fullWidth
            required
            sx={commonTextFieldStyles}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </Box>

        {/* Delivery Address */}
        <Box sx={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" }}>
          <img src={location} alt="address" style={{ width: 24, height: 24, marginRight: 10, marginTop: 10 }} />
          <TextField
            name="deliveryAddress"
            label="Delivery Address"
            multiline
            rows={2}
            variant="standard"
            fullWidth
            required
            sx={commonTextFieldStyles}
            value={formData.deliveryAddress}
            onChange={handleChange}
          />
        </Box>

        {/* Password */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img src={passwordIcon} alt="password" style={{ width: 24, height: 24, marginRight: 10 }} />
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="standard"
            fullWidth
            required
            sx={commonTextFieldStyles}
            value={formData.password}
            onChange={handleChange}
          />
        </Box>

        {/* Confirm Password */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
          <img src={passwordIcon} alt="confirm password" style={{ width: 24, height: 24, marginRight: 10 }} />
          <TextField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="standard"
            fullWidth
            required
            sx={commonTextFieldStyles}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Box>

        {/* Register Button */}
        <Button
          variant="contained"
          fullWidth
          disabled={isLoading}
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
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#0097A7";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#00B8D4";
          }}
          onClick={handleRegister}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ color: "#fff", fontSize: "14px" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#00E5FF", textDecoration: "underline" }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
