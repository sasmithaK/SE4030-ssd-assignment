import api from './axios';

export const getAllOrders = () => api.get('/orders');
export const createOrder = (order) => api.post('/orders', order);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
