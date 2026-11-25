"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Plus,
  X,
  Trash2,
  RotateCcw,
  Ban,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from "@/redux/service/user/userApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "CUSTOMER" | string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "HOLD" | "BLOCKED" | string;
  isDeleted: boolean;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer");
  const [initialStatus, setInitialStatus] = useState("ACTIVE");

  const { data: apiUsersResponse, isLoading, refetch } = useGetAllUsersQuery({
    searchTerm: searchTerm || undefined,
  });
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();

  const users: AdminUser[] = (apiUsersResponse?.data || []).map((u: any) => ({
    id: u?.id || "",
    name: u?.name || "Unnamed",
    email: u?.email || "",
    phone: u?.phone || "",
    role: u?.role || "customer",
    status: u?.status || "ACTIVE",
    isDeleted: !!u?.isDeleted,
    totalOrders: u?.totalOrders || 0,
    totalSpent: u?.totalSpent || 0,
    createdAt: u?.createdAt || new Date().toISOString(),
  }));

  const handleUpdateStatus = async (u: AdminUser, newStatus: string) => {
    try {
      await updateUserStatus({ id: u.id, status: newStatus.toUpperCase() }).unwrap();
      toast.success(`User "${u.name}" status updated to ${newStatus}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleToggleDeleted = async (u: AdminUser) => {
    try {
      if (!u.isDeleted) {
        await deleteUser(u.id).unwrap();
        toast.warning(`User "${u.name}" moved to deleted (soft delete).`);
      } else {
        await restoreUser(u.id).unwrap();
        toast.success(`User "${u.name}" restored successfully.`);
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user delete status");
    }
  };

  const handleToggleRole = (u: AdminUser) => {
    toast.info("Role editing is restricted to database admin");
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Users can register via storefront signup");
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchRole = roleFilter === "all" || u.role === roleFilter;

    let matchStatus = true;
    if (statusFilter === "deleted") {
      matchStatus = u.isDeleted === true;
    } else if (statusFilter === "all") {
      // By default in 'all', show non-deleted users unless searched
      matchStatus = !u.isDeleted || searchTerm.length > 0;
    } else {
      matchStatus = u.status === statusFilter && !u.isDeleted;
    }

    return matchSearch && matchRole && matchStatus;
  });

  const getStatusBadge = (status: string, isDeleted: boolean) => {
    if (isDeleted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-rose-900 text-white border border-rose-950 uppercase tracking-wider">
          <Trash2 size={10} /> Deleted
        </span>
      );
    }
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
            <CheckCircle2 size={10} /> Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-300 uppercase tracking-wider">
            <Clock size={10} /> Inactive
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
            <AlertTriangle size={10} /> Suspended
          </span>
        );
      case "hold":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
            <Clock size={10} /> On Hold
          </span>
        );
      case "banned":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 uppercase tracking-wider">
            <Ban size={10} /> Banned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#166534]">
            User &amp; Team Management
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight uppercase mt-0.5">
            Registered Users ({filteredUsers.length})
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Manage customer accounts, permissions, administrative privileges, soft-deletion, and 5 account statuses (Active, Inactive, Suspended, Hold, Banned).
          </p>
        </div>

        <button
          onClick={() => {
            setName("");
            setEmail("");
            setPhone("");
            setRole("customer");
            setInitialStatus("active");
            setIsModalOpen(true);
          }}
          className="bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer rounded-none"
        >
          <Plus size={16} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/90 p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, or phone..."
              className="w-full bg-[#fbf9f6] border border-neutral-200 pl-9 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors rounded-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-neutral-500 uppercase mr-1">
              Role:
            </span>
            {[
              { id: "all", label: "All Roles" },
              { id: "customer", label: "Customers" },
              { id: "admin", label: "Admins" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id as any)}
                className={`px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer rounded-none ${
                  roleFilter === tab.id
                    ? "bg-[#111827] text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Tabs (5 Statuses + All + Deleted) */}
        <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase mr-1">
            Status:
          </span>
          {[
            { id: "all", label: "All Non-Deleted" },
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
            { id: "suspended", label: "Suspended" },
            { id: "hold", label: "Hold" },
            { id: "banned", label: "Banned" },
            { id: "deleted", label: "Soft Deleted" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer rounded-none ${
                  isActive
                    ? "bg-[#166534] text-white"
                    : "bg-[#fbf9f6] text-neutral-600 hover:bg-neutral-200 border border-neutral-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <TableSkeleton rows={7} columns={7} hasThumbnails={true} />
      ) : (
        <div className="bg-white border border-neutral-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf6f2] text-neutral-600 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Orders &amp; Spent</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">isDeleted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Users size={32} className="mx-auto mb-2 opacity-40" />
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-neutral-50/70 transition-colors ${
                      u.isDeleted ? "bg-rose-50/20 opacity-75" : ""
                    }`}
                  >
                    {/* User Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 text-white font-bold flex items-center justify-center text-xs shrink-0 ${
                            u.isDeleted
                              ? "bg-rose-900"
                              : u.role === "admin"
                              ? "bg-[#166534]"
                              : "bg-neutral-900"
                          }`}
                        >
                          {u.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                            <span className={u.isDeleted ? "line-through text-neutral-500" : ""}>
                              {u.name}
                            </span>
                            {u.role === "admin" && (
                              <ShieldCheck size={13} className="text-[#166534]" />
                            )}
                            {u.isDeleted && (
                              <span className="text-[9px] bg-red-600 text-white font-bold px-1 py-0.2 uppercase">
                                Deleted
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-neutral-700">
                      <div>{u.email || "—"}</div>
                      <div className="text-[10px] text-neutral-400">{u.phone || "—"}</div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleRole(u)}
                        title="Click to switch role"
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                          u.role === "admin"
                            ? "bg-[#166534] text-white border-[#166534]"
                            : "bg-neutral-100 text-neutral-800 border-neutral-300 hover:bg-neutral-200"
                        }`}
                      >
                        {u.role}
                      </button>
                    </td>

                    {/* Orders & Spent */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">
                        {u.totalOrders} orders
                      </div>
                      <div className="text-[10px] text-neutral-500 font-medium">
                        ৳ {u.totalSpent.toLocaleString()} spent
                      </div>
                    </td>

                    {/* Status (Selector for active, inactive, suspended, hold, banned) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div>{getStatusBadge(u.status, u.isDeleted)}</div>
                        <select
                          value={u.status}
                          disabled={u.isDeleted}
                          onChange={(e) =>
                            handleUpdateStatus(u, e.target.value)
                          }
                          className="text-[10px] font-bold bg-[#fbf9f6] border border-neutral-300 py-0.5 px-1.5 text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer disabled:opacity-40"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="SUSPENDED">Suspended</option>
                          <option value="HOLD">Hold</option>
                          <option value="BLOCKED">Blocked</option>
                        </select>
                      </div>
                    </td>

                    {/* isDeleted Boolean Field */}
                    <td className="py-3.5 px-4">
                      {u.isDeleted ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 uppercase tracking-wider">
                          true
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 uppercase tracking-wider">
                          false
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRole(u)}
                        className="text-[11px] font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                        title="Switch Role"
                      >
                        {u.role === "admin" ? "Demote" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleToggleDeleted(u)}
                        className={`text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 ${
                          u.isDeleted
                            ? "text-emerald-700 hover:underline"
                            : "text-rose-600 hover:underline"
                        }`}
                        title={u.isDeleted ? "Restore Account" : "Soft Delete Account"}
                      >
                        {u.isDeleted ? (
                          <>
                            <RotateCcw size={12} />
                            <span>Restore</span>
                          </>
                        ) : (
                          <>
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 rounded-none">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <h3 className="text-sm font-extrabold uppercase tracking-tight text-neutral-900">
                Create User / Administrator
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanzid Mahmud"
                  required
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Email Address (Optional if Phone provided)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@xovaar.com"
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Mobile Phone Number (Optional if Email provided)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Account Role
                  </label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={initialStatus}
                    onChange={(e: any) => setInitialStatus(e.target.value)}
                    className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="HOLD">Hold</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-neutral-500 font-medium">
                  Note: Newly added user will have <code>isDeleted: false</code> by default.
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#166534] hover:bg-[#14532d] text-xs font-bold uppercase tracking-wider text-white shadow-xs cursor-pointer rounded-none"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
