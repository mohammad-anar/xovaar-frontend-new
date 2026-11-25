/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export type OrderStatus =
  | "PENDING"
  | "HOLD"
  | "CONFIRMED"
  | "MANUAL"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELED"
  | "RETURNED";

export interface OrderItem {
  id: string;
  productId?: string;
  title: string;
  price: number;
  imageUrl?: string;
  size: string;
  quantity: number;
}

export interface OrderData {
  id: string;
  orderNumber: string; // e.g. "XV-0001"
  userId?: string | null;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  deliveryNote?: string;
  deliveryType: "inside" | "outside";
  deliveryFee: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  isManual: boolean;
  items: OrderItem[];
  invoice?: {
    id: string;
    invoiceNumber: string; // e.g. "INV-0001"
    totalAmount: number;
    status: string;
    issuedAt: string;
  };
  auth?: {
    accessToken: string;
    refreshToken: string;
    user: any;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  deliveryNote?: string;
  deliveryType: "inside" | "outside";
  deliveryFee?: number;
  paymentMethod?: string;
  isManual?: boolean;
  items: Array<{
    productId?: string;
    title: string;
    price: number;
    imageUrl?: string;
    size: string;
    quantity: number;
  }>;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      { success: boolean; data: OrderData[]; meta: { total: number; page: number; limit: number; totalPage: number } },
      { status?: string; search?: string; isManual?: boolean; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["orders"],
    }),

    getMyOrders: builder.query<{ success: boolean; data: OrderData[] }, void>({
      query: () => ({
        url: "/orders/my-orders",
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    getOrderByNumberOrId: builder.query<{ success: boolean; data: OrderData }, string>({
      query: (orderNumberOrId) => ({
        url: `/orders/${orderNumberOrId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "orders", id }],
    }),

    createOrder: builder.mutation<{ success: boolean; data: OrderData }, CreateOrderPayload>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "analytics"],
    }),

    updateOrderStatus: builder.mutation<
      { success: boolean; data: OrderData },
      { id: string; status: OrderStatus }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["orders", "analytics"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByNumberOrIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApi;

export default orderApi;
