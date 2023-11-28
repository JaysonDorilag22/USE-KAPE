// orderSlice.js
import { createSlice } from '@reduxjs/toolkit';
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
  },
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    clearOrders: (state) => {
      state.orders = [];
    },
    updateStatus: (state, action) => {
      // Find the order by ID and update its status
      const { orderId, newStatus } = action.payload;
      const orderToUpdate = state.orders.find(order => order.id === orderId);

      if (orderToUpdate) {
        orderToUpdate.status = newStatus;
      }
    },
  },
});

export const { addOrder, clearOrders, updateStatus } = orderSlice.actions;

export default orderSlice.reducer;
