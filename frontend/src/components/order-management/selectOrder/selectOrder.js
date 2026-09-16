import React from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Card,
  CardMedia,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  IconButton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SelectOrder = () => {
  const [size, setSize] = React.useState("regular");
  const [qty, setQty] = React.useState(1);
  const [specialInstructions, setSpecialInstructions] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { name, price, image } = location.state || {
    name: "",
    price: 0,
    image: "",
  };

  const handleSize = (_, newSize) => {
    if (newSize !== null) setSize(newSize);
  };

  const changeQty = (delta) => setQty((q) => Math.max(1, q + delta));

  const getAdjustedPrice = () => (size === "regular" ? price : price + 200);

  const handleAddToOrder = async () => {
    const orderItem = {
      name: name,
      price: getAdjustedPrice().toFixed(2),
      portion: size,
      specialInstructions: specialInstructions,
      qty: qty,
    };

    const orderPayload = {
      orderItems: [orderItem],
    };

    try {
      const response = await axios.post(
        "http://localhost:8083/api/orders/customer/17", // your Spring Boot endpoint
        orderPayload
      );
      console.log("Order created:", response.data);
      alert("Order created successfully!");
      navigate("/cart", { state: { orderDetails: { ...orderItem, image } } });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: { xs: 2, md: 4 },
        bgcolor: "#fff",
        color: "#333",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      {/* Image */}
      <Card
        sx={{
          bgcolor: "#f5f5f5",
          boxShadow: "none",
          borderRadius: 2,
          mb: { xs: 2, md: 4 },
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image={image || "https://via.placeholder.com/600x300?text=No+Image"}
          alt={`${name} image`}
          sx={{ objectFit: "cover" }}
        />
      </Card>

      {/* Title & Price */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 1, md: 2 },
        }}
      >
        <Typography variant="h4">{name}</Typography>
        <Typography variant="h5">LKR {getAdjustedPrice()}</Typography>
      </Box>

      <Divider sx={{ bgcolor: "#e0e0e0", my: { xs: 2, md: 3 } }} />

      {/* Size Selector */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 1, md: 2 },
        }}
      >
        <Typography variant="subtitle1">Choice of Size</Typography>
        <Typography variant="body2" color="text.secondary">
          Required
        </Typography>
      </Box>

      <ToggleButtonGroup
        value={size}
        exclusive
        onChange={handleSize}
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        <ToggleButton
          value="regular"
          sx={{
            borderColor: "#e0e0e0",
            bgcolor: size === "regular" ? "primary.light" : "transparent",
            color: size === "regular" ? "#fff" : "text.primary",
            px: 3,
          }}
        >
          Regular
        </ToggleButton>
        <ToggleButton
          value="full"
          sx={{
            borderColor: "#e0e0e0",
            bgcolor: size === "full" ? "primary.light" : "transparent",
            color: size === "full" ? "#fff" : "text.primary",
            px: 3,
          }}
        >
          Full (+LKR 200)
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ bgcolor: "#e0e0e0", my: { xs: 2, md: 3 } }} />

      {/* Special Instructions */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography variant="subtitle1" gutterBottom>
          Special Instructions
        </Typography>
        <TextField
          placeholder="Add a note"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          You may be charged for extras.
        </Typography>
      </Box>

      {/* Quantity Selector */}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          mb: { xs: 3, md: 4 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        <IconButton onClick={() => changeQty(-1)}>
          <RemoveIcon />
        </IconButton>
        <Typography sx={{ minWidth: 40, textAlign: "center" }}>{qty}</Typography>
        <IconButton onClick={() => changeQty(1)}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* Add to Order Button */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{
          bgcolor: "primary.main",
          color: "#fff",
          textTransform: "none",
          py: 1.8,
          fontSize: "1rem",
        }}
        onClick={handleAddToOrder}
      >
        Add {qty} to order • LKR {(getAdjustedPrice() * qty).toFixed(2)}
      </Button>
    </Box>
  );
};

export default SelectOrder;
