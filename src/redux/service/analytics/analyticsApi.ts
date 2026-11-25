/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import { OrderData } from "../order/orderApi";

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockCount: number;
  recentOrders: OrderData[];
}

export interface SalesAnalytics {
  revenueChartData: Array<{ month: string; revenue: number; orders: number }>;
  statusCounts: Record<string, number>;
  deliveryBreakdown: {
    insideDhaka: number;
    outsideDhaka: number;
  };
  categoryDistribution: Array<{ name: string; productCount: number }>;
  subCategoryDistribution: Array<{ name: string; count: number }>;
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<{ success: boolean; data: DashboardOverview }, void>({
      query: () => ({
        url: "/analytics/overview",
        method: "GET",
      }),
      providesTags: ["analytics", "orders"],
    }),

    getSalesAnalytics: builder.query<{ success: boolean; data: SalesAnalytics }, void>({
      query: () => ({
        url: "/analytics/sales",
        method: "GET",
      }),
      providesTags: ["analytics", "orders"],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetSalesAnalyticsQuery,
} = analyticsApi;

export default analyticsApi;
