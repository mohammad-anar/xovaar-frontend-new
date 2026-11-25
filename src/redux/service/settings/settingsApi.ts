/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export interface StoreSettings {
  id: string;
  storeName: string;
  storeTagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  insideDhakaShipping: number;
  outsideDhakaShipping: number;
  freeShippingThreshold: number;
  noticeTicker: string;
  adminName: string;
  adminEmail: string;
  createdAt: string;
  updatedAt: string;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<{ success: boolean; data: StoreSettings }, void>({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    updateSettings: builder.mutation<{ success: boolean; data: StoreSettings }, Partial<StoreSettings>>({
      query: (body) => ({
        url: "/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["settings"],
    }),

    updateAdminProfile: builder.mutation<
      { success: boolean; data: any },
      { name?: string; email?: string; phone?: string; currentPassword?: string; newPassword?: string }
    >({
      query: (body) => ({
        url: "/settings/admin-profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["settings", "user"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateAdminProfileMutation,
} = settingsApi;

export default settingsApi;
