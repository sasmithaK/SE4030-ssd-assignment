import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Modal,
  Box as ModalBox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedPortion, setUpdatedPortion] = useState('regular');
  const [updatedQty, setUpdatedQty] = useState(1);
  const [updatedSpecialInstructions, setUpdatedSpecialInstructions] = useState('');

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/orders/customer/17');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchCustomerOrders();
  }, []);

  const handleAddItemsClick = () => {
    navigate('/menu');
  };

  const handleDeleteItem = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8083/api/orders/${orderId}/customer/17`);
      setOrders(prevOrders => 
        prevOrders.filter(order => order.id !== orderId)
      );
      setSnackbarMessage('Item removed successfully');
      setSnackbarOpen(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete item';
      setError(errorMsg);
      setSnackbarMessage(errorMsg);
      setSnackbarOpen(true);
    }
  };

  const calculateItemPrice = (item) => {
    const basePrice = parseFloat(item.price);
    return item.portion === 'full' ? basePrice + 200 : basePrice;
  };

  const handleQuantityChange = async (orderId, itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const response = await axios.patch(
        `http://localhost:8083/api/orders/${orderId}/items/${itemId}/customer/17`,
        { qty: newQty }
      );
      setOrders(prevOrders =>
        prevOrders.map(order => 
          order.id === response.data.id ? response.data : order
        )
      );
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update quantity';
      setError(errorMsg);
      setSnackbarMessage(errorMsg);
      setSnackbarOpen(true);
    }
  };

  const handleUpdateItem = (orderId, itemId) => {
    const order = orders.find(o => o.id === orderId);
    const item = order?.orderItems.find(i => i.id === itemId);
    
    if (item) {
      setSelectedItem({ ...item, orderId });
      setUpdatedPortion(item.portion);
      setUpdatedQty(item.qty);
      setUpdatedSpecialInstructions(item.specialInstructions || '');
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setUpdatedPortion('regular');
    setUpdatedQty(1);
    setUpdatedSpecialInstructions('');
  };

  const handleUpdateItemSubmit = async () => {
    if (!selectedItem) return;

    try {
      const response = await axios.patch(
        `http://localhost:8083/api/orders/${selectedItem.orderId}/items/${selectedItem.id}/customer/17`,
        {
          portion: updatedPortion,
          qty: updatedQty,
          specialInstructions: updatedSpecialInstructions,
        }
      );
      setOrders(prevOrders =>
        prevOrders.map(order => 
          order.id === response.data.id ? response.data : order
        )
      );
      handleModalClose();
      setSnackbarMessage('Item updated successfully');
      setSnackbarOpen(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update item';
      setError(errorMsg);
      setSnackbarMessage(errorMsg);
      setSnackbarOpen(true);
    }
  };

  const calculateSubtotal = () => {
    return orders.reduce((sum, order) => {
      return sum + order.orderItems.reduce((orderSum, item) => {
        const itemPrice = calculateItemPrice(item);
        return orderSum + (itemPrice * item.qty);
      }, 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  const handleCheckout = () => {
    navigate('/', { state: { orders } });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: { xs: '100%', md: 800, lg: 1000 },
        mx: 'auto',
        p: { xs: 2, md: 4 },
        bgcolor: '#fafafa',
        color: '#333',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
        <IconButton sx={{ mr: 1 }} onClick={() => navigate(-1)}>
          <Typography variant="h6">{'←'}</Typography>
        </IconButton>
        <Typography variant="h5">Araliya Food Cabin</Typography>
      </Box>

      <Divider sx={{ bgcolor: 'grey.300', mb: { xs: 2, md: 3 } }} />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Cart Items */}
      {orders.length === 0 ? (
        <Typography sx={{ textAlign: 'center', py: 4 }}>
          Your cart is empty
        </Typography>
      ) : (
        orders.flatMap(order =>
          order.orderItems.map(item => (
            <Box key={`${order.id}-${item.id}`} sx={{ display: 'flex', mb: { xs: 2, md: 3 } }}>
              <Box
                component="img"
                src={item.imageUrl || 'https://via.placeholder.com/100'}
                alt={item.name}
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 80, md: 100 },
                  borderRadius: 1,
                  objectFit: 'cover',
                  mr: { xs: 1.5, md: 3 },
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Portion: {item.portion === 'regular' ? 'Regular' : 'Full'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ordered: {new Date(order.orderDate).toLocaleString()}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  LKR {(calculateItemPrice(item) * item.qty).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <IconButton onClick={() => handleUpdateItem(order.id, item.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteItem(order.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    overflow: 'hidden',
                    mt: 1,
                  }}
                >
                  <IconButton 
                    size="small"
                    onClick={() => handleQuantityChange(order.id, item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 32, textAlign: 'center' }}>
                    {item.qty}
                  </Typography>
                  <IconButton 
                    size="small"
                    onClick={() => handleQuantityChange(order.id, item.id, item.qty + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))
        )
      )}

      {/* Add Items */}
      <Button
        variant="outlined"
        fullWidth
        onClick={handleAddItemsClick}
        sx={{
          borderColor: 'grey.400',
          color: 'text.primary',
          textTransform: 'none',
          mb: { xs: 2, md: 3 },
          py: { xs: 1, md: 1.5 },
        }}
      >
        + Add items
      </Button>

      <Divider sx={{ bgcolor: 'grey.300', mb: { xs: 2, md: 3 } }} />

      {/* Subtotal */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Subtotal</Typography>
        <Typography variant="h6">LKR {subtotal.toFixed(2)}</Typography>
      </Box>

      {/* Checkout Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleCheckout}
        sx={{
          textTransform: 'none',
          py: { xs: 1, md: 1.5 },
          bgcolor: '#1976d2',
          ':hover': { bgcolor: '#1565c0' },
        }}
      >
        Proceed to Checkout
      </Button>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />

      {/* Edit Item Modal */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <ModalBox
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: { xs: 300, md: 400 },
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Update Item
          </Typography>

          {/* Portion Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Portion</InputLabel>
            <Select
              value={updatedPortion}
              onChange={(e) => setUpdatedPortion(e.target.value)}
              label="Portion"
            >
              <MenuItem value="regular">Regular</MenuItem>
              <MenuItem value="full">Full</MenuItem>
            </Select>
          </FormControl>

          {/* Quantity Field */}
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={updatedQty}
            onChange={(e) => setUpdatedQty(Number(e.target.value))}
            sx={{ mb: 2 }}
          />

          {/* Special Instructions */}
          <TextField
            label="Special Instructions"
            fullWidth
            multiline
            rows={3}
            value={updatedSpecialInstructions}
            onChange={(e) => setUpdatedSpecialInstructions(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" fullWidth onClick={handleUpdateItemSubmit}>
            Update
          </Button>
        </ModalBox>
      </Modal>
    </Box>
  );
};

export default Cart;
