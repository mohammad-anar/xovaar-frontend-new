"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Truck,
  CreditCard,
  Target,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 84000, target: 80000, orders: 92 },
  { month: "Feb", revenue: 96000, target: 90000, orders: 110 },
  { month: "Mar", revenue: 115000, target: 100000, orders: 135 },
  { month: "Apr", revenue: 108000, target: 110000, orders: 122 },
  { month: "May", revenue: 132000, target: 120000, orders: 154 },
  { month: "Jun", revenue: 148000, target: 135000, orders: 178 },
  { month: "Jul", revenue: 165000, target: 150000, orders: 195 },
  { month: "Aug", revenue: 158000, target: 155000, orders: 184 },
  { month: "Sep", revenue: 182000, target: 165000, orders: 215 },
  { month: "Oct", revenue: 195000, target: 180000, orders: 232 },
  { month: "Nov", revenue: 218000, target: 190000, orders: 260 },
];

const CATEGORY_SHARE = [
  { name: "Drop-Shoulder T-Shirts", value: 42, color: "#166534" },
  { name: "Sweat Shirts", value: 31, color: "#111827" },
  { name: "Hoodies", value: 27, color: "#b87c2b" },
];

const DELIVERY_SHARE = [
  { name: "Inside Dhaka (৳70)", orders: 198, revenue: 178200 },
  { name: "Outside Dhaka (৳130)", orders: 86, revenue: 98400 },
];

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState<"year" | "month">("year");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = () => {
    toast.success("Generating Analytics CSV Report...", {
      description: "Report downloaded to local device.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#166534]">
            Business Intelligence
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight uppercase mt-0.5">
            Analytics &amp; Performance Reports
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            In-depth sales metrics, category revenue shares, and shipping distributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/90 p-5 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Average Order Value (AOV)
          </div>
          <div className="text-2xl font-black text-neutral-900">৳ 1,845</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            +6.4% from last month
          </div>
        </div>

        <div className="bg-white border border-neutral-200/90 p-5 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Gross Sales YTD
          </div>
          <div className="text-2xl font-black text-neutral-900">৳ 1.62M</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            +23.1% YoY growth
          </div>
        </div>

        <div className="bg-white border border-neutral-200/90 p-5 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Returning Customer Rate
          </div>
          <div className="text-2xl font-black text-neutral-900">38.6%</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            High brand loyalty
          </div>
        </div>

        <div className="bg-white border border-neutral-200/90 p-5 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Cart Conversion Rate
          </div>
          <div className="text-2xl font-black text-neutral-900">4.82%</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            Above industry average (3.2%)
          </div>
        </div>
      </div>

      {/* Main Revenue vs Target Chart */}
      <div className="bg-white border border-neutral-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 mb-6 gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <TrendingUp size={15} className="text-[#166534]" /> Annual Gross Sales vs Projected Target
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Monthly breakdown in BDT
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-neutral-800">
              <span className="w-3 h-3 bg-[#166534] rounded-xs" /> Actual Revenue
            </span>
            <span className="flex items-center gap-1.5 text-neutral-500">
              <span className="w-3 h-3 bg-neutral-300 rounded-xs" /> Target
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MONTHLY_REVENUE}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
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
                  formatter={(val: any) => [`৳ ${Number(val).toLocaleString()}`, "Amount"]}
                />
                <Bar dataKey="target" fill="#e5e7eb" radius={[3, 3, 0, 0]} />
                <Bar dataKey="revenue" fill="#166534" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-neutral-400">
              Loading analytics chart...
            </div>
          )}
        </div>
      </div>

      {/* Category Share & Delivery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Share */}
        <div className="lg:col-span-6 bg-white border border-neutral-200/90 p-6 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Layers size={15} className="text-[#166534]" /> Revenue By Category
          </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Current sales split among 3 key apparel segments
          </p>

          <div className="h-56 w-full mt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_SHARE}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {CATEGORY_SHARE.map((entry, index) => (
                      <Cell key={`cat-${index}`} fill={entry.color} />
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
                    formatter={(val: any) => [`${val}%`, "Revenue Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          <div className="space-y-2 pt-4 border-t border-neutral-100 text-xs">
            {CATEGORY_SHARE.map((cat, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-neutral-700 font-medium">{cat.name}</span>
                </span>
                <span className="font-bold text-neutral-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Courier Shipping Volume */}
        <div className="lg:col-span-6 bg-white border border-neutral-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Truck size={15} className="text-[#166534]" /> Delivery Geography Distribution
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Inside Dhaka (৳70) vs Outside Dhaka (৳130) volume
            </p>

            <div className="space-y-5 mt-6">
              {DELIVERY_SHARE.map((del, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-neutral-800">{del.name}</span>
                    <span className="font-bold text-neutral-900">
                      {del.orders} orders ({Math.round((del.orders / (198 + 86)) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${i === 0 ? "bg-[#166534]" : "bg-[#111827]"}`}
                      style={{
                        width: `${Math.round((del.orders / (198 + 86)) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-neutral-500 flex justify-between">
                    <span>Generated Revenue</span>
                    <span className="font-semibold text-neutral-800">
                      ৳ {del.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#faf6f2] border border-[#e8ded6] mt-6 rounded-xs text-xs text-neutral-700">
            <strong>Fulfillment SLA:</strong> Inside Dhaka average delivery duration is 28 hours. Outside Dhaka average is 2.8 days across all 64 districts.
          </div>
        </div>
      </div>
    </div>
  );
}