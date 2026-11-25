// Client-side persistent data management for Admin Dashboard
import { DEFAULT_NEW_ARRIVALS, ProductItem } from "@/redux/service/product/productApi";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  parentCategory: string;
  itemCount: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

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

export interface AdminOrder {
  id: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  deliveryNote?: string;
  deliveryType: "inside" | "outside";
  deliveryFee: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  manual?: boolean;
  date: string;
  paymentMethod: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    size: string;
    quantity: number;
  }>;
}

export type UserStatus = "active" | "inactive" | "suspended" | "hold" | "banned";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  status: UserStatus;
  isDeleted: boolean;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
}

export interface AdminSettings {
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
}

const DEFAULT_CATEGORIES: AdminCategory[] = [
  {
    id: "cat-1",
    name: "Drop-Shoulder T-Shirt",
    slug: "drop-shoulder",
    parentCategory: "Men",
    itemCount: 5,
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "cat-2",
    name: "Sweat Shirt",
    slug: "sweat",
    parentCategory: "Men",
    itemCount: 5,
    status: "Active",
    createdAt: "2026-01-12",
  },
  {
    id: "cat-3",
    name: "Hoodie",
    slug: "hoodie",
    parentCategory: "Men",
    itemCount: 5,
    status: "Active",
    createdAt: "2026-01-15",
  },
];

const DEFAULT_USERS: AdminUser[] = [
  {
    id: "usr-1",
    name: "Tanzid Mahmud",
    email: "admin@xovaar.com",
    phone: "0162039613",
    role: "admin",
    status: "active",
    isDeleted: false,
    joinedDate: "15 Jan 2026",
    totalOrders: 6,
    totalSpent: 12450,
  },
  {
    id: "usr-2",
    name: "Sadia Rahman",
    email: "sadia.rahman@gmail.com",
    phone: "01819876543",
    role: "customer",
    status: "active",
    isDeleted: false,
    joinedDate: "02 Feb 2026",
    totalOrders: 3,
    totalSpent: 4890,
  },
  {
    id: "usr-3",
    name: "Mahin Ahmed",
    email: "mahin.ahmed@yahoo.com",
    phone: "01912445566",
    role: "customer",
    status: "hold",
    isDeleted: false,
    joinedDate: "10 Mar 2026",
    totalOrders: 2,
    totalSpent: 3180,
  },
  {
    id: "usr-4",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@hotmail.com",
    phone: "01678112233",
    role: "customer",
    status: "inactive",
    isDeleted: false,
    joinedDate: "20 Apr 2026",
    totalOrders: 5,
    totalSpent: 8750,
  },
  {
    id: "usr-5",
    name: "Kazi Rafiqul",
    email: "kazi.rafiq@gmail.com",
    phone: "01555667788",
    role: "customer",
    status: "suspended",
    isDeleted: false,
    joinedDate: "05 Jun 2026",
    totalOrders: 1,
    totalSpent: 850,
  },
  {
    id: "usr-6",
    name: "Imran Hossain",
    email: "imran.bad@example.com",
    phone: "01300998877",
    role: "customer",
    status: "banned",
    isDeleted: false,
    joinedDate: "01 Jul 2026",
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: "usr-7",
    name: "Archived User",
    email: "archived.user@example.com",
    phone: "01400112233",
    role: "customer",
    status: "inactive",
    isDeleted: true,
    joinedDate: "01 Jan 2026",
    totalOrders: 0,
    totalSpent: 0,
  },
];

const DEFAULT_ORDERS: AdminOrder[] = [
  {
    id: "XV-89421",
    customerName: "Tanzid Mahmud",
    phoneNumber: "01712345678",
    deliveryAddress: "House 42, Road 11, Banani, Dhaka-1213",
    deliveryType: "inside",
    deliveryFee: 70,
    subtotal: 2980,
    total: 3050,
    status: "DELIVERED",
    manual: false,
    date: "20 Nov 2026, 02:45 PM",
    paymentMethod: "Cash On Delivery",
    items: [
      {
        id: "prod-1",
        title: "Men White 'SILENCE' Graphic Oversized Drop-Shoulder Tee",
        price: 790,
        imageUrl: "/products/product-5.jpg",
        size: "L",
        quantity: 1,
      },
      {
        id: "prod-11",
        title: "Men Dual-Tone Colorblock Fleece Hoodie - Maroon & Charcoal",
        price: 2190,
        imageUrl: "/products/product-6.jpg",
        size: "XL",
        quantity: 1,
      },
    ],
  },
  {
    id: "XV-87114",
    customerName: "Sadia Rahman",
    phoneNumber: "01819876543",
    deliveryAddress: "Apartment 4B, Dhanmondi 27, Dhaka",
    deliveryType: "inside",
    deliveryFee: 70,
    subtotal: 1250,
    total: 1320,
    status: "SHIPPED",
    manual: false,
    date: "22 Nov 2026, 11:30 AM",
    paymentMethod: "Cash On Delivery",
    items: [
      {
        id: "prod-6",
        title: "Men Spider '00' Graphic Crewneck Sweat Shirt - Sand Khaki",
        price: 1250,
        imageUrl: "/products/product-1.jpg",
        size: "M",
        quantity: 1,
      },
    ],
  },
  {
    id: "XV-90245",
    customerName: "Mahin Ahmed",
    phoneNumber: "01912445566",
    deliveryAddress: "GEC Circle, Nasirabad, Chattogram",
    deliveryType: "outside",
    deliveryFee: 130,
    subtotal: 2390,
    total: 2520,
    status: "PROCESSING",
    manual: false,
    date: "24 Nov 2026, 09:15 AM",
    paymentMethod: "Cash On Delivery",
    items: [
      {
        id: "prod-12",
        title: "Men 'DOPE' Streetwear Fleece Hoodie - Cream & Sage Green",
        price: 2290,
        imageUrl: "/products/product-8.jpg",
        size: "L",
        quantity: 1,
      },
    ],
  },
  {
    id: "XV-91338",
    customerName: "Nusrat Jahan",
    phoneNumber: "01678112233",
    deliveryAddress: "Sector 7, Road 14, Uttara, Dhaka",
    deliveryType: "inside",
    deliveryFee: 70,
    subtotal: 890,
    total: 960,
    status: "PENDING",
    manual: false,
    date: "24 Nov 2026, 01:20 PM",
    paymentMethod: "Cash On Delivery",
    items: [
      {
        id: "prod-4",
        title: "Men Twin Streetwear Graphic Drop-Shoulder Tee Set",
        price: 890,
        imageUrl: "/products/product-11.jpg",
        size: "M",
        quantity: 1,
      },
    ],
  },
  {
    id: "XV-92015",
    customerName: "Imran Khan (Manual Hotline)",
    phoneNumber: "0162039613",
    deliveryAddress: "Road 4, Block B, Mirpur-10, Dhaka",
    deliveryType: "inside",
    deliveryFee: 70,
    subtotal: 1580,
    total: 1650,
    status: "MANUAL",
    manual: true,
    date: "25 Nov 2026, 10:15 AM",
    paymentMethod: "Cash On Delivery",
    items: [
      {
        id: "prod-1",
        title: "Men White 'SILENCE' Graphic Oversized Drop-Shoulder Tee",
        price: 790,
        imageUrl: "/products/product-5.jpg",
        size: "XL",
        quantity: 2,
      },
    ],
  },
];

const DEFAULT_SETTINGS: AdminSettings = {
  storeName: "Xovaar",
  storeTagline: "Minimalist-Aura • Signature Blend of Comfort",
  supportEmail: "support@xovaar.com",
  supportPhone: "0162039613",
  currency: "৳",
  insideDhakaShipping: 70,
  outsideDhakaShipping: 130,
  freeShippingThreshold: 3000,
  noticeTicker: "Fast 24-48 Hours Express Delivery Across Dhaka • Easy 7-Day Free Exchange",
  adminName: "Super Admin",
  adminEmail: "admin@xovaar.com",
};

// --- Storage Keys ---
const KEYS = {
  PRODUCTS: "admin_products",
  CATEGORIES: "admin_categories",
  ORDERS: "admin_orders",
  USERS: "admin_users",
  SETTINGS: "admin_settings",
  AUTH: "admin_authenticated",
};

export const AdminStorage = {
  // PRODUCTS
  getProducts(): ProductItem[] {
    if (typeof window === "undefined") return DEFAULT_NEW_ARRIVALS;
    try {
      const stored = localStorage.getItem(KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.some(
            (p: ProductItem) =>
              p.imageUrl?.includes("unsplash") ||
              p.images?.some((img) => img?.includes("unsplash"))
          )
        ) {
          localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_NEW_ARRIVALS));
          return DEFAULT_NEW_ARRIVALS;
        }
        return parsed;
      }
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_NEW_ARRIVALS));
      return DEFAULT_NEW_ARRIVALS;
    } catch {
      return DEFAULT_NEW_ARRIVALS;
    }
  },

  saveProducts(products: ProductItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct(product: ProductItem): ProductItem[] {
    const list = this.getProducts();
    const updated = [product, ...list];
    this.saveProducts(updated);
    return updated;
  },

  updateProduct(product: ProductItem): ProductItem[] {
    const list = this.getProducts();
    const updated = list.map((p) => (p.id === product?.id ? product : p));
    this.saveProducts(updated);
    return updated;
  },

  deleteProduct(id: string): ProductItem[] {
    const list = this.getProducts();
    const updated = list.filter((p) => p.id !== id);
    this.saveProducts(updated);
    return updated;
  },

  // CATEGORIES
  getCategories(): AdminCategory[] {
    if (typeof window === "undefined") return DEFAULT_CATEGORIES;
    try {
      const stored = localStorage.getItem(KEYS.CATEGORIES);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories(categories: AdminCategory[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // ORDERS
  getOrders(): AdminOrder[] {
    if (typeof window === "undefined") return DEFAULT_ORDERS;
    try {
      // Also check user_orders placed from public checkout
      const publicOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
      const stored = localStorage.getItem(KEYS.ORDERS);
      let rawOrders: any[] = stored ? JSON.parse(stored) : DEFAULT_ORDERS;

      // Status migration helper to map any legacy/cased status to OrderStatus
      const normalizeStatus = (status: string): OrderStatus => {
        const s = String(status || "").toUpperCase().trim();
        if (s === "PENDING") return "PENDING";
        if (s === "HOLD") return "HOLD";
        if (s === "CONFIRMED") return "CONFIRMED";
        if (s === "MANUAL") return "MANUAL";
        if (s === "PROCESSING") return "PROCESSING";
        if (s === "SHIPPED" || s === "IN TRANSIT") return "SHIPPED";
        if (s === "OUT_FOR_DELIVERY" || s === "OUT FOR DELIVERY") return "OUT_FOR_DELIVERY";
        if (s === "DELIVERED") return "DELIVERED";
        if (s === "CANCELED" || s === "CANCELLED") return "CANCELED";
        if (s === "RETURNED") return "RETURNED";
        return "PENDING";
      };

      let adminOrders: AdminOrder[] = rawOrders.map((o) => {
        const normStatus = normalizeStatus(o.status);
        const isManual = normStatus === "MANUAL" ? true : Boolean(o.manual);
        return {
          ...o,
          status: normStatus,
          manual: isManual,
        };
      });

      // Merge new public orders if not already in adminOrders
      if (Array.isArray(publicOrders) && publicOrders.length > 0) {
        publicOrders.forEach((po: any) => {
          if (!adminOrders.some((ao) => ao.id === po.id || ao.id.replace("#", "") === po.id.replace("#", ""))) {
            adminOrders.unshift({
              id: po.id.startsWith("XV-") ? po.id : `XV-${po.id.replace(/[^0-9]/g, "")}`,
              customerName: po.customerName || "Website Customer",
              phoneNumber: po.customerPhone || "017XXXXXXXX",
              deliveryAddress: po.deliveryAddress || "Dhaka, Bangladesh",
              deliveryType: po.deliveryType || "inside",
              deliveryFee: po.deliveryFee ?? 70,
              subtotal: (po.total || 0) - (po.deliveryFee ?? 70),
              total: po.total || 0,
              status: normalizeStatus(po.status || "PENDING"),
              manual: Boolean(po.manual),
              date: po.date || "Today",
              paymentMethod: po.paymentMethod || "Cash On Delivery",
              items: Array.isArray(po.items)
                ? po.items.map((it: any, idx: number) => ({
                  id: it.id || `item-${idx}`,
                  title: typeof it === "string" ? it : it.title || "Product Item",
                  price: it.price || Math.round(po.total / po.items.length),
                  imageUrl: it.imageUrl,
                  size: it.size || "M",
                  quantity: it.quantity || 1,
                }))
                : [],
            });
          }
        });
      }

      localStorage.setItem(KEYS.ORDERS, JSON.stringify(adminOrders));
      return adminOrders;
    } catch {
      return DEFAULT_ORDERS;
    }
  },

  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    manual?: boolean
  ): AdminOrder[] {
    const list = this.getOrders();
    const updated = list.map((o) => {
      if (o.id === orderId) {
        const isManual =
          status === "MANUAL"
            ? true
            : manual !== undefined
              ? manual
              : (o.manual ?? false);
        return {
          ...o,
          status,
          manual: isManual,
        };
      }
      return o;
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
    }
    return updated;
  },

  toggleOrderManual(orderId: string): AdminOrder[] {
    const list = this.getOrders();
    const updated = list.map((o) => {
      if (o.id === orderId) {
        const nextManual = !o.manual;
        return {
          ...o,
          manual: nextManual,
          status: nextManual
            ? ("MANUAL" as OrderStatus)
            : o.status === "MANUAL"
              ? ("PENDING" as OrderStatus)
              : o.status,
        };
      }
      return o;
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
    }
    return updated;
  },

  // USERS
  getUsers(): AdminUser[] {
    if (typeof window === "undefined") return DEFAULT_USERS;
    try {
      const stored = localStorage.getItem(KEYS.USERS);
      if (stored) {
        const parsed: any[] = JSON.parse(stored);
        const validStatuses: UserStatus[] = [
          "active",
          "inactive",
          "suspended",
          "hold",
          "banned",
        ];
        const sanitized: AdminUser[] = parsed.map((u) => ({
          ...u,
          status: validStatuses.includes(u.status) ? u.status : "active",
          isDeleted: typeof u.isDeleted === "boolean" ? u.isDeleted : false,
        }));
        return sanitized;
      }
      localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveUsers(users: AdminUser[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  toggleUserDeleted(id: string): AdminUser[] {
    const users = this.getUsers().map((u) =>
      u.id === id ? { ...u, isDeleted: !u.isDeleted } : u
    );
    this.saveUsers(users);
    return users;
  },

  updateUserStatus(id: string, status: UserStatus): AdminUser[] {
    const users = this.getUsers().map((u) =>
      u.id === id ? { ...u, status } : u
    );
    this.saveUsers(users);
    return users;
  },

  // SETTINGS
  getSettings(): AdminSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed.supportPhone === "+880 9678-800800" ||
          parsed.supportPhone === "+8809677666888"
        ) {
          parsed.supportPhone = "0162039613";
          localStorage.setItem(KEYS.SETTINGS, JSON.stringify(parsed));
        }
        return parsed;
      }
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AdminSettings) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // AUTH
  isAdminLoggedIn(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(KEYS.AUTH) === "true";
  },

  setAdminLoggedIn(status: boolean) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.AUTH, status ? "true" : "false");
  },
};
