import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  email?: string;
  phone?: string;
  exp?: number;
  iat?: number;
  role?: string;
  userId?: string;
  name?: string;
};

interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading?: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        user: UserType | null;
        accessToken: string | null;
        refreshToken: string | null;
      }>
    ) {
      state.user = action.payload.user;
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      if (typeof window !== "undefined") {
        document.cookie =
          "roll=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/";
      }
    },
  },
});

export const {
  setUser,
  setAccessToken,
  setIsLoading,
  logout,
  setRefreshToken,
} = authSlice.actions;

export default authSlice.reducer;
