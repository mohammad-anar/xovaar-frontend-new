import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductItem } from "@/redux/service/product/productApi";

interface WishlistState {
  items: ProductItem[];
}

const initialState: WishlistState = {
  items: [
    {
      id: "prod-6",
      title: "Men Spider '00' Graphic Crewneck Sweat Shirt - Sand Khaki",
      price: 1250.0,
      originalPrice: 1650.0,
      imageUrl: "/products/product-1.jpg",
      images: [
        "/products/product-1.jpg",
        "/products/product-2.jpg",
      ],
      category: "Men",
      subCategory: "Sweat Shirt",
      inStock: true,
    },
    {
      id: "prod-13",
      title: "Men Vintage 'CHAOS' Earth Tone Heavyweight Hoodie - Warm Brown",
      price: 2390.0,
      originalPrice: 3100.0,
      imageUrl: "/products/product-10.jpg",
      images: [
        "/products/product-10.jpg",
        "/products/product-12.jpg",
      ],
      category: "Men",
      subCategory: "Hoodie",
      inStock: true,
    },
  ],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<ProductItem>) {
      const idx = state.items.findIndex((item) => item.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
