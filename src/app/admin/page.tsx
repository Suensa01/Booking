"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Clock,
  ChefHat,
  PackageCheck,
  AlertCircle,
  Phone,
  Mail,
  X,
  Lock,
  KeyRound,
  Printer,
  DollarSign,
  Loader2,
  ArrowLeft,
  Download,
  Plus,
  TrendingUp,
  Trash2,
  LogOut,
  EyeOff,
} from "lucide-react";
import { Order, OrderStatus, Reservation, MenuItem } from "@/types";
import { useToast } from "@/context/ToastContext";

type AdminTab = "orders" | "reservations" | "menu" | "analytics";

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New Dish Modal state
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [newDishData, setNewDishData] = useState({
    name: "",
    category: "Pizza",
    price: "",
    description: "",
    image: "",
    isVeg: true,
  });
  const [addingDish, setAddingDish] = useState(false);

  // Authentication & Session state
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("mohit.work@gmail.com");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [submittingAuth, setSubmittingAuth] = useState<boolean>(false);

  const { showToast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, resRes, menuRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/reservations"),
        fetch("/api/menu"),
      ]);

      const ordersData = await ordersRes.json();
      const resData = await resRes.json();
      const menuData = await menuRes.json();

      if (ordersData.success) setOrders(ordersData.data || []);
      if (resData.success) setReservations(resData.data || []);
      if (menuData.success) setMenuItems(menuData.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching dashboard data.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Check active admin session on mount
  useEffect(() => {
    let ignore = false;
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        if (!ignore) {
          if (data.authenticated) {
            setIsAuthenticated(true);
            setAdminEmail(data.email || "mohit.work@gmail.com");
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch {
        if (!ignore) setIsAuthenticated(false);
      } finally {
        if (!ignore) setAuthChecking(false);
      }
    }
    checkSession();
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch dashboard data only when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    let ignore = false;

    async function loadInitialData() {
      try {
        const [ordersRes, resRes, menuRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/reservations"),
          fetch("/api/menu"),
        ]);

        const ordersData = await ordersRes.json();
        const resData = await resRes.json();
        const menuData = await menuRes.json();

        if (!ignore) {
          if (ordersData.success) setOrders(ordersData.data || []);
          if (resData.success) setReservations(resData.data || []);
          if (menuData.success) setMenuItems(menuData.data || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Error fetching dashboard data.";
          showToast(msg, "error");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialData();
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, showToast]);

  // Update order status with Optimistic UI
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const previousOrders = [...orders];

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not update status.");
      }
      showToast(`Order #${orderId} marked as "${newStatus}"`, "success");
    } catch (err: unknown) {
      setOrders(previousOrders);
      const msg = err instanceof Error ? err.message : "Status update failed.";
      showToast(`Rollback: ${msg}`, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle dish availability
  const handleToggleDish = async (dishId: number) => {
    try {
      const res = await fetch(`/api/menu/${dishId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleAvailability: true }),
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems((prev) =>
          prev.map((item) => (item.id === dishId ? { ...item, available: !item.available } : item))
        );
        showToast(data.message, "success");
      }
    } catch {
      showToast("Failed to toggle dish availability.", "error");
    }
  };

  // Delete dish from catalog
  const handleDeleteDish = async (dishId: number, dishName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${dishName}" from the menu?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/menu/${dishId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMenuItems((prev) => prev.filter((item) => item.id !== dishId));
        showToast(data.message || `Dish "${dishName}" deleted.`, "success");
      } else {
        showToast(data.error || "Failed to delete dish.", "error");
      }
    } catch {
      showToast("Error deleting dish.", "error");
    }
  };

  // Add new dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishData.name.trim() || !newDishData.price) {
      showToast("Please provide dish name and price.", "error");
      return;
    }
    setAddingDish(true);
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDishData),
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems((prev) => [...prev, data.data]);
        showToast(data.message, "success");
        setIsAddDishOpen(false);
        setNewDishData({
          name: "",
          category: "Pizza",
          price: "",
          description: "",
          image: "",
          isVeg: true,
        });
      } else {
        showToast(data.error || "Failed to add dish", "error");
      }
    } catch {
      showToast("Error adding dish.", "error");
    } finally {
      setAddingDish(false);
    }
  };

  // Update reservation status
  const handleReservationStatus = async (id: string, status: "Confirmed" | "Seated" | "Cancelled") => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        showToast(data.message, "success");
      }
    } catch {
      showToast("Failed to update reservation.", "error");
    }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = "Order ID,Customer,Mobile,Email,Total,Status,Date\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.customerName}","${o.mobile}","${o.email}","${o.total}","${o.status}","${o.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bites_orders_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Orders exported to CSV", "success");
  };

  // Filter orders
  const displayedOrders = orders.filter((order) => {
    if (filteredStatus !== "All" && order.status !== filteredStatus) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.mobile.includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  // Calculate metrics
  const totalRevenue = orders.reduce(
    (sum, ord) => sum + (ord.status !== "Cancelled" ? ord.total : 0),
    0
  );
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const cookingCount = orders.filter((o) => o.status === "Preparing" || o.status === "Accepted").length;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAuth(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminEmail(data.admin?.email || emailInput);
        showToast("Welcome back! Admin dashboard unlocked.", "success");
        setPasswordInput("");
      } else {
        setAuthError(data.error || "Invalid email or password.");
        showToast(data.error || "Authentication failed.", "error");
      }
    } catch {
      setAuthError("Network connection error. Please try again.");
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      setAdminEmail("");
      showToast("Logged out of Admin Portal.", "info");
    } catch {
      showToast("Error logging out.", "error");
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-amber-600 transition-colors mb-6 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customer Storefront
          </Link>

          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/20 mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-center text-3xl font-black text-stone-900 tracking-tight">Admin Portal Sign In</h1>
          <p className="mt-2 text-center text-xs text-stone-500 max-w-xs mx-auto">
            Authorized management access for kitchen operations, table bookings, and menu control.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl shadow-stone-200/50 rounded-[32px] border border-stone-200/80 sm:px-10">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="mohit.work@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-sm font-medium focus:bg-white focus:outline-hidden focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-sm font-medium focus:bg-white focus:outline-hidden focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submittingAuth}
                className="w-full py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submittingAuth ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed text-center">
                <strong>Review Credentials:</strong> <br />
                Email: <span className="font-mono text-amber-950">mohit.work@gmail.com</span> &nbsp;•&nbsp;
                Pass: <span className="font-mono text-amber-950">admin123</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Admin Identity */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customer Storefront
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {adminEmail || "mohit.work@gmail.com"}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 bg-white hover:bg-rose-50 px-3.5 py-1.5 rounded-full border border-stone-200 hover:border-rose-200 shadow-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        <>
          {/* Header & Main Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Central Operations Portal</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                  Kitchen & Store Management
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-xs shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4 text-stone-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs transition-colors"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs (Orders, Reservations, Menu, Analytics) */}
            <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-8 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                  activeTab === "orders"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Live Orders ({orders.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("reservations")}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                  activeTab === "reservations"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Table Bookings ({reservations.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("menu")}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                  activeTab === "menu"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Menu Catalog ({menuItems.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                  activeTab === "analytics"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Insights & Analytics
              </button>
            </div>

            {/* TAB 1: LIVE ORDERS */}
            {activeTab === "orders" && (
              <>
                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Total Revenue
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-stone-900">
                        ₹{totalRevenue.toFixed(0)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Pending
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-amber-600">
                        {pendingCount}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <ChefHat className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Cooking
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-orange-600">
                        {cookingCount}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <PackageCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Completed
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-sky-700">
                        {orders.filter((o) => o.status === "Completed").length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter and Search */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" />
                      Status:
                    </span>
                    {["All", "Pending", "Accepted", "Preparing", "Completed", "Cancelled"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFilteredStatus(st)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                          filteredStatus === st
                            ? "bg-amber-400 text-stone-950 font-black shadow-xs"
                            : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search order ID or customer..."
                      className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAF5ED] border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                          <th className="py-4 px-6">Order ID</th>
                          <th className="py-4 px-6">Customer & Phone</th>
                          <th className="py-4 px-6">Items Ordered</th>
                          <th className="py-4 px-6">Total & Method</th>
                          <th className="py-4 px-6">Stage Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-sm">
                        {displayedOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-amber-50/20 transition-colors">
                            <td className="py-4 px-6 align-top">
                              <span className="font-mono font-bold text-stone-900">{order.id}</span>
                              <div className="text-[11px] text-stone-400 mt-0.5">
                                {new Date(order.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>

                            <td className="py-4 px-6 align-top">
                              <strong className="text-stone-900 block font-bold">
                                {order.customerName}
                              </strong>
                              <a
                                href={`tel:${order.mobile}`}
                                className="text-xs text-amber-700 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <Phone className="w-3 h-3" />
                                {order.mobile}
                              </a>
                            </td>

                            <td className="py-4 px-6 align-top">
                              <div className="text-stone-800 font-semibold">
                                {order.items.reduce((s, i) => s + i.quantity, 0)} items ({order.orderType || "Delivery"})
                              </div>
                              <div className="text-xs text-stone-400 truncate max-w-xs mt-0.5">
                                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                              </div>
                            </td>

                            <td className="py-4 px-6 align-top">
                              <span className="font-black text-stone-900 text-base">
                                ₹{order.total.toFixed(2)}
                              </span>
                              <div className="text-[11px] text-stone-500">
                                {order.paymentMethod || "COD"} ({order.paymentStatus || "Pending"})
                              </div>
                            </td>

                            <td className="py-4 px-6 align-top">
                              <div className="relative inline-block">
                                <select
                                  value={order.status}
                                  disabled={updatingId === order.id}
                                  onChange={(e) =>
                                    handleStatusChange(order.id, e.target.value as OrderStatus)
                                  }
                                  className={`text-xs font-black uppercase tracking-wider py-1.5 px-3 rounded-full border appearance-none pr-7 cursor-pointer transition-colors focus:outline-hidden ${
                                    order.status === "Completed"
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                      : order.status === "Preparing"
                                      ? "bg-amber-100 text-amber-900 border-amber-300"
                                      : order.status === "Accepted"
                                      ? "bg-sky-50 text-sky-800 border-sky-300"
                                      : order.status === "Cancelled"
                                      ? "bg-rose-50 text-rose-800 border-rose-300"
                                      : "bg-orange-50 text-orange-800 border-orange-300"
                                  }`}
                                >
                                  {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-[10px]">
                                  ▼
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6 align-top text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Details</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: TABLE RESERVATIONS */}
            {activeTab === "reservations" && (
              <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-stone-900">Table Reservations</h2>
                    <p className="text-xs text-stone-500">Live guest bookings submitted via web app</p>
                  </div>
                </div>

                <div className="divide-y divide-stone-100">
                  {reservations.map((res) => (
                    <div key={res.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-amber-600 text-sm">{res.id}</span>
                          <strong className="text-stone-900 font-bold text-base">{res.customerName}</strong>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            {res.guests} Guests
                          </span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              res.status === "Confirmed"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : res.status === "Seated"
                                ? "bg-sky-50 text-sky-800 border border-sky-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-3">
                          <span>📅 {res.date} at {res.timeSlot}</span>
                          <span>•</span>
                          <span>📍 {res.seatingArea}</span>
                          <span>•</span>
                          <a href={`tel:${res.mobile}`} className="text-amber-700 hover:underline">
                            📞 {res.mobile}
                          </a>
                        </div>
                        {res.specialRequests && (
                          <p className="text-xs text-stone-600 italic mt-1">
                            Notes: “{res.specialRequests}”
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {res.status !== "Seated" && (
                          <button
                            type="button"
                            onClick={() => handleReservationStatus(res.id, "Seated")}
                            className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          >
                            Mark Seated
                          </button>
                        )}
                        {res.status !== "Cancelled" && (
                          <button
                            type="button"
                            onClick={() => handleReservationStatus(res.id, "Cancelled")}
                            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-rose-100 text-rose-700 font-bold text-xs"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MENU MANAGEMENT */}
            {activeTab === "menu" && (
              <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-stone-900">Menu Catalog Management</h2>
                    <p className="text-xs text-stone-500">Toggle live dish availability or add new items to the menu</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddDishOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Dish</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((dish) => (
                    <div
                      key={dish.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                        dish.available ? "bg-white border-stone-200" : "bg-stone-50 border-stone-200 opacity-60"
                      }`}
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        <Image src={dish.image} alt={dish.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-stone-900 text-sm truncate">{dish.name}</h4>
                        <span className="text-xs text-stone-400 block">{dish.category} • ₹{dish.price}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            dish.available ? "text-emerald-700" : "text-rose-600"
                          }`}
                        >
                          ● {dish.available ? "In Stock" : "Sold Out"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleDish(dish.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                            dish.available
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-rose-50 hover:text-rose-700"
                              : "bg-amber-100 text-stone-900 border-amber-300"
                          }`}
                        >
                          {dish.available ? "Mark Sold Out" : "Restore"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDish(dish.id, dish.name)}
                          title="Delete dish from menu"
                          className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm">
                  <h3 className="font-black text-stone-900 text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Financial Overview
                  </h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Gross Sales</span>
                      <strong className="text-stone-900 font-black">₹{totalRevenue.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Average Order Value (AOV)</span>
                      <strong className="text-stone-900 font-black">₹{avgOrderValue.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Total Orders Placed</span>
                      <strong className="text-stone-900 font-black">{orders.length}</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-stone-500">Total Table Reservations</span>
                      <strong className="text-stone-900 font-black">{reservations.length}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm">
                  <h3 className="font-black text-stone-900 text-lg mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-amber-500" />
                    Kitchen Efficiency Metrics
                  </h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Orders in Kitchen Preparation</span>
                      <strong className="text-amber-600 font-black">{cookingCount}</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Average Delivery Fulfillment Time</span>
                      <strong className="text-emerald-700 font-black">28 Minutes</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Menu Dish Items Active</span>
                      <strong className="text-stone-900 font-black">
                        {menuItems.filter((i) => i.available).length} / {menuItems.length}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADD DISH MODAL */}
            {isAddDishOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs" onClick={() => setIsAddDishOpen(false)} />
                <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-[32px] p-6 shadow-2xl border border-stone-200 z-10">
                  <button
                    type="button"
                    onClick={() => setIsAddDishOpen(false)}
                    className="absolute right-5 top-5 p-2 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-xl font-black text-stone-900 mb-4">Add Dish to Menu</h3>
                  <form onSubmit={handleCreateDish} className="flex flex-col gap-3 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Dish Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Quattro Formaggi Pizza"
                        value={newDishData.name}
                        onChange={(e) => setNewDishData({ ...newDishData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Category</label>
                        <select
                          value={newDishData.category}
                          onChange={(e) => setNewDishData({ ...newDishData, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                        >
                          <option value="Pizza">Pizza</option>
                          <option value="Burgers">Burgers</option>
                          <option value="Pasta">Pasta</option>
                          <option value="Sides">Sides</option>
                          <option value="Desserts">Desserts</option>
                          <option value="Beverages">Beverages</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Price (₹)</label>
                        <input
                          type="number"
                          placeholder="349"
                          value={newDishData.price}
                          onChange={(e) => setNewDishData({ ...newDishData, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        placeholder="Artisanal description of ingredients..."
                        value={newDishData.description}
                        onChange={(e) => setNewDishData({ ...newDishData, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newDishData.image}
                        onChange={(e) => setNewDishData({ ...newDishData, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isVegCheck"
                        checked={newDishData.isVeg}
                        onChange={(e) => setNewDishData({ ...newDishData, isVeg: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500"
                      />
                      <label htmlFor="isVegCheck" className="font-bold text-stone-700">Pure Vegetarian Dish</label>
                    </div>

                    <button
                      type="submit"
                      disabled={addingDish}
                      className="mt-3 w-full py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm"
                    >
                      {addingDish ? "Adding..." : "Add to Catalog"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ORDER DETAILS MODAL */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 overflow-hidden flex pl-10" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
                <div className="relative ml-auto w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
                  <div className="p-6 border-b border-stone-200/80 flex items-center justify-between bg-[#FDFBF7]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Order Receipt</span>
                      <h2 className="font-mono text-2xl font-black text-stone-900">{selectedOrder.id}</h2>
                    </div>
                    <button type="button" onClick={() => setSelectedOrder(null)} className="p-2 text-stone-400 hover:text-stone-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-sm">
                    {/* Status Switcher */}
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                      <span className="text-xs font-bold text-stone-800 block mb-2">Advance Kitchen Preparation</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(["Pending", "Accepted", "Preparing", "Completed"] as OrderStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(selectedOrder.id, st)}
                            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
                              selectedOrder.status === st
                                ? "bg-amber-400 text-stone-950 shadow-xs"
                                : "bg-white text-stone-700 hover:bg-amber-100"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Customer</span>
                        <strong className="text-stone-900">{selectedOrder.customerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Phone</span>
                        <a href={`tel:${selectedOrder.mobile}`} className="text-amber-700 font-bold hover:underline">
                          {selectedOrder.mobile}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Email</span>
                        <a href={`mailto:${selectedOrder.email}`} className="text-stone-700">
                          {selectedOrder.email}
                        </a>
                      </div>
                      <div className="pt-2 border-t border-stone-200">
                        <span className="text-stone-500 block mb-1">Address</span>
                        <p className="text-stone-900 leading-snug">{selectedOrder.address}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="font-bold text-stone-800 mb-2">Ordered Dishes</h4>
                      <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-4 bg-white">
                        {selectedOrder.items.map((i) => (
                          <div key={i.id} className="py-2 flex justify-between">
                            <span>{i.quantity}x {i.name}</span>
                            <strong>₹{(i.price * i.quantity).toFixed(2)}</strong>
                          </div>
                        ))}
                        <div className="pt-3 flex justify-between text-xs text-stone-500">
                          <span>Subtotal</span>
                          <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        {selectedOrder.discount && selectedOrder.discount > 0 && (
                          <div className="flex justify-between text-xs text-emerald-700 font-bold">
                            <span>Discount ({selectedOrder.couponCode || "Promo"})</span>
                            <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="pt-2 flex justify-between text-base font-black text-stone-900">
                          <span>Total</span>
                          <span className="text-amber-600">₹{selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-stone-200 bg-[#FDFBF7] flex justify-between">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2.5 rounded-full bg-white border border-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-4 h-4" />
                      Print Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      className="px-6 py-2.5 rounded-full bg-stone-900 text-white font-bold text-xs"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
      </div>
    </div>
  );
}
