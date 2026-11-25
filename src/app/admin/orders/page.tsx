"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  XCircle,
  PhoneCall,
  MapPin,
  X,
  Package,
  Printer,
} from "lucide-react";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  OrderData,
  OrderStatus,
} from "@/redux/service/order/orderApi";
import { getImageUrl } from "@/lib/utils";
import OrderPrintInvoice from "@/components/invoice/OrderPrintInvoice";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data: apiOrders, isLoading, refetch } = useGetOrdersQuery({
    search: searchTerm || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
  });
  const [updateStatus] = useUpdateOrderStatusMutation();

  const orders: OrderData[] = apiOrders?.data || [];

  // Selected order for full view modal
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  // Order selected specifically for 1-page printable invoice
  const [invoiceOrder, setInvoiceOrder] = useState<OrderData | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(`Order status changed to ${newStatus}`);
      refetch();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      (o?.orderNumber || o?.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o?.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o?.phoneNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || o?.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "HOLD":
        return "bg-yellow-50 text-yellow-800 border-yellow-300";
      case "CONFIRMED":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "MANUAL":
        return "bg-purple-100 text-purple-900 border-purple-300 font-extrabold";
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "SHIPPED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "OUT_FOR_DELIVERY":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELED":
        return "bg-red-50 text-red-700 border-red-200";
      case "RETURNED":
        return "bg-rose-50 text-rose-800 border-rose-300";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#166534]">
            Operations &amp; Fulfillment
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight uppercase mt-0.5">
            Order Management ({filteredOrders.length})
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Track customer deliveries, update courier tracking statuses, and inspect receipts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-neutral-500 uppercase text-[11px]">
            COD Status:
          </span>
          <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 border border-emerald-200">
            Payment On Delivery Active
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer name, or phone..."
            className="w-full bg-[#fbf9f6] border border-neutral-200 pl-9 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
          {[
            "All",
            "PENDING",
            "HOLD",
            "CONFIRMED",
            "MANUAL",
            "PROCESSING",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELED",
            "RETURNED",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xs text-[11px] font-bold tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
                statusFilter === tab
                  ? "bg-[#166534] text-white shadow-2xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <TableSkeleton rows={7} columns={6} hasThumbnails={false} />
      ) : (
        <div className="bg-white border border-neutral-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf6f2] text-neutral-600 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">Order ID &amp; Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Delivery Route</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status &amp; Action</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <ShoppingBag size={32} className="mx-auto mb-2 opacity-40" />
                    No orders found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-neutral-50/70 transition-colors"
                  >
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-neutral-900">
                          {order.orderNumber || order.id}
                        </span>
                        {order.isManual && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
                            MANUAL
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-neutral-600 font-medium">
                        {order.phoneNumber}
                      </div>
                    </td>

                    {/* Delivery Route */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-800 block">
                        {order.deliveryType === "inside"
                          ? "Inside Dhaka (৳ 70)"
                          : "Outside Dhaka (৳ 130)"}
                      </span>
                      <span className="text-[10px] text-neutral-400 line-clamp-1">
                        {order.deliveryAddress}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-neutral-900">
                        ৳ {order?.total?.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-400 uppercase">
                        {order?.paymentMethod || "—"}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e: any) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`text-[11px] font-bold px-2 py-1 rounded border focus:outline-none cursor-pointer ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="HOLD">HOLD</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="MANUAL">MANUAL</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELED">CANCELED</option>
                        <option value="RETURNED">RETURNED</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-700 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                          title="View order details"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#166534] hover:text-[#14532d] bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#bbf7d0] px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                          title="Print 1-Page Customer Invoice"
                        >
                          <Printer size={12} />
                          <span>Print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-100 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#166534]">
                  Order Details
                </span>
                <h3 className="text-xl font-extrabold uppercase tracking-tight text-neutral-900">
                  {selectedOrder.orderNumber || selectedOrder.id}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()} &bull; Payment via {selectedOrder.paymentMethod}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Delivery Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#faf6f2] border border-[#eadece] mb-6 text-xs text-neutral-700">
              <div>
                <div className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#166534]" /> Customer Address
                </div>
                <p className="font-semibold text-neutral-900">{selectedOrder.customerName}</p>
                <p>{selectedOrder.deliveryAddress}</p>
                <p className="flex items-center gap-1 text-neutral-600 mt-1">
                  <PhoneCall size={12} /> {selectedOrder.phoneNumber}
                </p>
              </div>

              <div>
                <div className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1.5">
                  <Truck size={13} className="text-[#166534]" /> Fulfillment Status
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-neutral-600">Current Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e: any) =>
                      handleStatusChange(selectedOrder.id, e.target.value)
                    }
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="HOLD">HOLD</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="MANUAL">MANUAL</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELED">CANCELED</option>
                    <option value="RETURNED">RETURNED</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-neutral-600">Manual Order:</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black uppercase rounded border ${
                      selectedOrder.isManual
                        ? "bg-purple-600 text-white border-purple-700 shadow-2xs"
                        : "bg-neutral-100 text-neutral-600 border-neutral-300"
                    }`}
                  >
                    {selectedOrder.isManual ? "✓ YES (MANUAL ORDER)" : "NO (REGULAR ORDER)"}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Delivery route: {selectedOrder.deliveryType === "inside" ? "Dhakar Vitore" : "Dhakar Bahire"}
                </p>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-1.5">
                <Package size={14} className="text-[#166534]" /> Purchased Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-neutral-100 max-h-48 overflow-y-auto border border-neutral-100">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {it.imageUrl && (
                        <div className="relative w-10 h-12 bg-neutral-100 shrink-0 border border-neutral-200">
                          <Image
                            src={getImageUrl(it.imageUrl)}
                            alt={it.title}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-neutral-900 line-clamp-1">{it.title}</p>
                        <p className="text-[11px] text-neutral-400">
                          Size: {it.size} &bull; Qty: {it.quantity} &bull; ৳ {it?.price?.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900">
                      ৳ {((it?.price || 0) * (it?.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-neutral-200 pt-3 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">
                  ৳ {selectedOrder.subtotal?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-medium text-neutral-900">
                  ৳ {selectedOrder.deliveryFee}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Grand Total</span>
                <span>৳ {selectedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between no-print">
              <span className="text-[11px] text-neutral-400">
                Official single-page invoice ready for courier dispatch
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close Receipt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const toPrint = selectedOrder;
                    setSelectedOrder(null);
                    setInvoiceOrder(toPrint);
                  }}
                  className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={13} />
                  <span>Print Invoice (1 Page)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official 1-Page Printable Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-neutral-300 max-w-4xl w-full shadow-2xl rounded overflow-hidden my-6">
            {/* Modal Top Bar (Hidden on print) */}
            <div className="no-print bg-[#111827] text-white px-5 py-3.5 flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Printer size={16} className="text-[#16A34A]" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Official 1-Page Invoice Preview &bull; {invoiceOrder.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Opening browser print dialog...");
                    window.print();
                  }}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={13} />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(null)}
                  className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                  aria-label="Close invoice preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div className="p-2 sm:p-4 bg-neutral-100/60 overflow-x-auto">
              <OrderPrintInvoice
                order={{
                  id: invoiceOrder.orderNumber || invoiceOrder.id,
                  customerName: invoiceOrder.customerName,
                  phoneNumber: invoiceOrder.phoneNumber,
                  deliveryAddress: invoiceOrder.deliveryAddress,
                  deliveryType: invoiceOrder.deliveryType,
                  deliveryFee: invoiceOrder.deliveryFee,
                  subtotal: invoiceOrder.subtotal,
                  total: invoiceOrder.total,
                  status: invoiceOrder.status,
                  manual: invoiceOrder.isManual,
                  date: invoiceOrder.createdAt,
                  paymentMethod: invoiceOrder.paymentMethod,
                  items: invoiceOrder.items,
                }}
              />
            </div>

            {/* Modal Bottom Bar (Hidden on print) */}
            <div className="no-print bg-neutral-50 px-6 py-3 border-t border-neutral-200 flex items-center justify-between text-xs">
              <span className="text-neutral-500 text-[11px]">
                Formatted for single-page A4 printing (Cash on delivery &amp; full details included)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(null)}
                  className="px-4 py-1.5 border border-neutral-300 hover:border-neutral-900 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Opening browser print dialog...");
                    window.print();
                  }}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={13} />
                  <span>Print Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}