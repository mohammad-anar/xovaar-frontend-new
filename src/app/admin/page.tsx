"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AdminStorage, AdminOrder } from "@/services/adminStore";
import {
  useGetProductsQuery,
  ProductItem,
} from "@/redux/service/product/productApi";
import { useGetDashboardOverviewQuery } from "@/redux/service/analytics/analyticsApi";
import { MetricGridSkeleton } from "@/components/skeleton/MetricCardSkeleton";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

// Chart Data
const REVENUE_DATA = [
  { day: "Mon", revenue: 14200, orders: 12 },
  { day: "Tue", revenue: 18500, orders: 15 },
  { day: "Wed", revenue: 12300, orders: 9 },
  { day: "Thu", revenue: 24800, orders: 20 },
  { day: "Fri", revenue: 29500, orders: 24 },
  { day: "Sat", revenue: 38200, orders: 31 },
  { day: "Sun", revenue: 31900, orders: 26 },
];

const STATUS_DATA = [
  { name: "Delivered", value: 45, color: "#10b981" },
  { name: "In Transit", value: 25, color: "#3b82f6" },
  { name: "Processing", value: 20, color: "#f59e0b" },
  { name: "Pending", value: 10, color: "#ef4444" },
];

export default function AdminOverviewPage() {
  const [mounted, setMounted] = useState(false);
  const { data: overviewResponse } = useGetDashboardOverviewQuery();
  const { data: productsResponse } = useGetProductsQuery();
  const overview = overviewResponse?.data;
  const products: ProductItem[] = productsResponse?.data || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalRevenue = overview?.totalRevenue ?? 0;
  const totalOrdersCount = overview?.totalOrders ?? 0;
  const pendingOrdersCount = overview?.pendingOrders ?? 0;
  const lowStockCount = overview?.lowStockCount ?? 0;
  const recentOrders = overview?.recentOrders ?? [];

  const kpis = [
    {
      title: "Total Revenue",
      value: `৳ ${totalRevenue.toLocaleString()}`,
      change: "+18.4%",
      isPositive: true,
      icon: DollarSign,
      sub: "Total non-canceled sales",
    },
    {
      title: "Total Orders",
      value: totalOrdersCount.toString(),
      change: `${pendingOrdersCount} pending`,
      isPositive: true,
      icon: ShoppingBag,
      sub: `${pendingOrdersCount} awaiting dispatch`,
    },
    {
      title: "Low Stock Alert",
      value: lowStockCount.toString(),
      change: lowStockCount > 0 ? "Action required" : "Healthy",
      isPositive: lowStockCount === 0,
      icon: Package,
      sub: "Items under 5 units",
    },
    {
      title: "System Status",
      value: "Live",
      change: "Connected",
      isPositive: true,
      icon: Users,
      sub: "Production API synced",
    },
  ];

  if (!mounted) {
    return (
      <div className="space-y-6 select-none animate-pulse">
        <div className="bg-white border border-neutral-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-2">
            <div className="w-24 h-3 bg-neutral-200" />
            <div className="w-56 h-6 bg-neutral-300 skeleton-shimmer" />
            <div className="w-80 h-3 bg-neutral-200" />
          </div>
        </div>
        <MetricGridSkeleton count={4} />
        <TableSkeleton rows={5} columns={6} hasThumbnails={false} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action */}
      <div className="bg-white border border-neutral-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#166534]">
            Dashboard Overview
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight uppercase mt-0.5">
            Store Performance &amp; Operations
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Real-time sales tracking, stock levels, and order fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="border border-neutral-300 hover:border-neutral-900 text-neutral-800 hover:text-black text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-neutral-200/90 p-5 shadow-2xs hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-center justify-between text-neutral-500 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                  {kpi.title}
                </span>
                <div className="w-8 h-8 rounded bg-[#f0fdf4] text-[#166534] flex items-center justify-center">
                  <Icon size={16} />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="text-2xl font-black text-neutral-900 tracking-tight">
                  {kpi.value}
                </div>
                <span
                  className={`text-[11px] font-bold flex items-center ${
                    kpi.isPositive ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {kpi.isPositive ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  {kpi.change}
                </span>
              </div>

              <p className="text-[10px] text-neutral-400 mt-1.5">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue & Weekly Performance (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-neutral-200/90 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <TrendingUp size={15} className="text-[#166534]" /> Weekly Revenue Trend
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Past 7 days gross revenue &amp; daily order volume
              </p>
            </div>
            <span className="text-[11px] font-bold bg-[#f0fdf4] text-[#166534] px-2 py-1 rounded">
              Current Week
            </span>
          </div>

          <div className="h-72 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={REVENUE_DATA}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `৳${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderRadius: "4px",
                      border: "none",
                      color: "#fff",
                      fontSize: "11px",
                    }}
                    formatter={(val: any) => [`৳ ${Number(val).toLocaleString()}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#166534"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                Loading sales chart...
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Order Fulfillment Ratio
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Live status breakdown
            </p>

            <div className="h-52 w-full mt-4">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderRadius: "4px",
                        border: "none",
                        color: "#fff",
                        fontSize: "11px",
                      }}
                      formatter={(val: any) => [`${val}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                  Loading ratio...
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-neutral-100 text-[11px]">
            {STATUS_DATA.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-neutral-600 font-medium truncate">
                  {s.name} ({s.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/90 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Recent Customer Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-[11px] font-bold text-[#166534] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf6f2] text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-neutral-900">{order.orderNumber || order.id}</span>
                        {(order.isManual || order.manual) && (
                          <span className="px-1 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
                            MANUAL
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-neutral-700">
                      <div className="font-semibold">{order.customerName}</div>
                      <div className="text-[10px] text-neutral-400">{order.phoneNumber}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-neutral-900">
                      ৳ {order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "SHIPPED"
                            ? "bg-indigo-50 text-indigo-700"
                            : order.status === "OUT_FOR_DELIVERY"
                            ? "bg-teal-50 text-teal-700"
                            : order.status === "PROCESSING"
                            ? "bg-blue-50 text-blue-700"
                            : order.status === "CONFIRMED"
                            ? "bg-cyan-50 text-cyan-700"
                            : order.status === "MANUAL"
                            ? "bg-purple-100 text-purple-900 font-extrabold"
                            : order.status === "HOLD"
                            ? "bg-yellow-50 text-yellow-800"
                            : order.status === "RETURNED"
                            ? "bg-rose-50 text-rose-800"
                            : order.status === "CANCELED"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-[11px] font-bold text-[#166534] hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/90 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Top Selling Items
            </h3>
            <Link
              href="/admin/products"
              className="text-[11px] font-bold text-[#166534] hover:underline flex items-center gap-1"
            >
              <span>View Catalog</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3.5">
            {products.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-14 bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {item.subCategory}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-neutral-900">
                    ৳ {item.price.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    In Stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}