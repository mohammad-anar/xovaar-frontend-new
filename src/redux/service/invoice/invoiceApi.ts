/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import { OrderData } from "../order/orderApi";

export interface InvoiceData {
  id: string;
  invoiceNumber: string; // e.g. "INV-0001"
  orderId: string;
  totalAmount: number;
  status: "ISSUED" | "PAID" | "CANCELED";
  issuedAt: string;
  order: OrderData;
  createdAt: string;
  updatedAt: string;
}

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoiceByNumber: builder.query<{ success: boolean; data: InvoiceData }, string>({
      query: (invoiceNumber) => ({
        url: `/invoices/${invoiceNumber}`,
        method: "GET",
      }),
      providesTags: (_res, _err, inv) => [{ type: "invoices", id: inv }],
    }),

    getInvoiceByOrderId: builder.query<{ success: boolean; data: InvoiceData }, string>({
      query: (orderId) => ({
        url: `/invoices/order/${orderId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "invoices", id }],
    }),
  }),
});

export const {
  useGetInvoiceByNumberQuery,
  useGetInvoiceByOrderIdQuery,
} = invoiceApi;

export default invoiceApi;
