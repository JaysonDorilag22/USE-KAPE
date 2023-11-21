// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const productInCart = state.find(item => item._id === action.payload._id);

      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      return state.filter(item => item._id !== action.payload._id);
    },
    decreaseQuantity: (state, action) => {
      const item = state.find(item => item._id === action.payload._id);
      if (item && item.quantity > 0) {
        item.quantity -= 1;
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.find(item => item._id === action.payload._id);
      if (item) {
        item.quantity += 1;
      }
    },
    clearCart: state => {
      return [];
    },
  },
});

export const { addToCart, removeFromCart, decreaseQuantity, increaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
