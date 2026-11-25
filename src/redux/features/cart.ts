import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  size: string;
  quantity: number;
  freeDelivery?: boolean;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [
    {
      id: "prod-1",
      title: "Men White 'SILENCE' Graphic Oversized Drop-Shoulder Tee",
      price: 790.0,
      imageUrl: "/products/product-5.jpg",
      size: "L",
      quantity: 1,
    },
    {
      id: "prod-11",
      title: "Men Dual-Tone Colorblock Fleece Hoodie - Maroon & Charcoal",
      price: 2190.0,
      imageUrl: "/products/product-6.jpg",
      size: "XL",
      quantity: 1,
    },
  ],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.isOpen = true; // Automatically open cart drawer on add
    },
    removeFromCart(
      state,
      action: PayloadAction<{ id: string; size: string }>
    ) {
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id && item.size === action.payload.size)
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; size: string; quantity: number }>
    ) {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i !== item);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    openCart(state) {
      state.isOpen = true;
    },
    closeCart(state) {
      state.isOpen = false;
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  openCart,
  closeCart,
  toggleCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
