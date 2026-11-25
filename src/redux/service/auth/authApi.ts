/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export interface SignupRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface SendOtpRequest {
  identifier: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface ResetPasswordRequest {
  identifier: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signupUser: builder.mutation<any, SignupRequest>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth", "user"],
    }),

    loginUser: builder.mutation<any, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth", "user"],
    }),

    refreshToken: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),

    sendOtp: builder.mutation<any, SendOtpRequest>({
      query: (body) => ({
        url: "/auth/send-otp",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<any, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<any, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["auth"],
    }),

    changePassword: builder.mutation<any, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useRefreshTokenMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;

export default authApi;
