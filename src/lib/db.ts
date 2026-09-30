import fs from "fs/promises";
import path from "path";
import { Order, MenuItem, Reservation, CustomerReview, Coupon, OrderStatus } from "@/types";
import { initialMenuItems, initialOrders } from "@/data/restaurantData";
import { getPrismaClient } from "./prisma";
import {
  GuestOrderInput,
  validateGuestOrderInput,
  GuestReservationInput,
  validateGuestReservationInput,
} from "./validators";

const STORAGE_DIR = path.join(process.cwd(), "data", "storage");
const ORDERS_FILE = path.join(STORAGE_DIR, "orders.json");
const MENU_FILE = path.join(STORAGE_DIR, "menu.json");
const RESERVATIONS_FILE = path.join(STORAGE_DIR, "reservations.json");
const REVIEWS_FILE = path.join(STORAGE_DIR, "reviews.json");

// Default initial sample reservations
const initialReservations: Reservation[] = [
  {
    id: "RES-201",
    customerName: "Aarav Patel",
    mobile: "9876543210",
    email: "aarav.p@example.com",
    guests: 4,
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    timeSlot: "07:30 PM",
    seatingArea: "Outdoor Terrace",
    specialRequests: "Window corner table for anniversary dinner.",
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "RES-202",
    customerName: "Priya Sharma",
    mobile: "9822334455",
    email: "priya.s@example.com",
    guests: 2,
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    timeSlot: "08:00 PM",
    seatingArea: "Chef's Counter",
    specialRequests: "Chef tasting menu experience.",
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  },
];

// Default customer reviews
const initialReviews: CustomerReview[] = [
  {
    id: "REV-1",
    name: "Savannah Nguyen",
    role: "Verified Foodie",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "This place is great! Atmosphere is chill and cool but the staff is also really friendly. They know what they're doing and what they're talking about, and you can tell making the customers happy is their main priority.",
    createdAt: "2026-09-28T14:20:00.000Z",
  },
  {
    id: "REV-2",
    name: "Esther Howard",
    role: "Gourmet Critic",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "The wood-fired crust and smash burgers are simply sublime. Delivery arrived in under 25 minutes, steaming hot in insulated boxes. Best gourmet food delivery experience by far!",
    createdAt: "2026-09-27T18:10:00.000Z",
  },
  {
    id: "REV-3",
    name: "Marvin McKinney",
    role: "Regular Customer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "Incredible flavors across every dish. From the creamy Alfredo pasta to the espresso tiramisu, everything tastes like it was made fresh 5 minutes ago by master chefs.",
    createdAt: "2026-09-26T20:45:00.000Z",
  },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "BITES10",
    description: "10% off your entire order (Min order ₹200)",
    discountPercent: 10,
    minOrder: 200,
  },
  {
    code: "WELCOME50",
    description: "Flat ₹50 off on your first order (Min order ₹300)",
    discountFixed: 50,
    minOrder: 300,
  },
  {
    code: "FREEDEL",
    description: "Free express delivery on any order",
    discountFixed: 40,
    minOrder: 150,
  },
];

async function ensureStorage() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(MENU_FILE);
    } catch {
      await fs.writeFile(MENU_FILE, JSON.stringify(initialMenuItems, null, 2), "utf-8");
    }
    try {
      await fs.access(ORDERS_FILE);
    } catch {
      await fs.writeFile(ORDERS_FILE, JSON.stringify(initialOrders, null, 2), "utf-8");
    }
    try {
      await fs.access(RESERVATIONS_FILE);
    } catch {
      await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(initialReservations, null, 2), "utf-8");
    }
    try {
      await fs.access(REVIEWS_FILE);
    } catch {
      await fs.writeFile(REVIEWS_FILE, JSON.stringify(initialReviews, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Storage directory initialization error:", err);
  }
}

// ---------------- MENU OPERATIONS ----------------
export async function getMenuItems(): Promise<MenuItem[]> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const items = await prisma.menuItem.findMany({
        orderBy: { id: "asc" },
      });
      if (items.length > 0) {
        return items.map((i) => ({
          id: i.id,
          name: i.name,
          description: i.description,
          category: i.category,
          price: i.price,
          image: i.image,
          available: i.available,
          isVeg: i.isVeg,
          rating: i.rating ?? 5.0,
          prepTime: i.prepTime ?? "15 min",
          badge: i.badge ?? undefined,
        }));
      }
    } catch (e) {
      console.warn("Prisma getMenuItems fallback to JSON storage:", e);
    }
  }

  await ensureStorage();
  try {
    const data = await fs.readFile(MENU_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return initialMenuItems;
  }
}

export async function saveMenuItems(items: MenuItem[]): Promise<void> {
  await ensureStorage();
  await fs.writeFile(MENU_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function fetchMenu(category?: string, search?: string): Promise<MenuItem[]> {
  let items = await getMenuItems();

  if (category && category !== "All") {
    items = items.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }

  return items;
}

export async function addMenuItem(newItemData: Omit<MenuItem, "id">): Promise<MenuItem> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const created = await prisma.menuItem.create({
        data: {
          name: newItemData.name,
          description: newItemData.description,
          category: newItemData.category,
          price: newItemData.price,
          image: newItemData.image,
          available: newItemData.available ?? true,
          isVeg: newItemData.isVeg ?? true,
          rating: newItemData.rating ?? 5.0,
          prepTime: newItemData.prepTime ?? "15 min",
          badge: newItemData.badge ?? null,
        },
      });
      return {
        id: created.id,
        name: created.name,
        description: created.description,
        category: created.category,
        price: created.price,
        image: created.image,
        available: created.available,
        isVeg: created.isVeg,
        rating: created.rating ?? 5.0,
        prepTime: created.prepTime ?? "15 min",
        badge: created.badge ?? undefined,
      };
    } catch (e) {
      console.warn("Prisma addMenuItem fallback to JSON storage:", e);
    }
  }

  const items = await getMenuItems();
  const maxId = items.reduce((max, item) => Math.max(max, item.id), 100);
  const newItem: MenuItem = {
    ...newItemData,
    id: maxId + 1,
  };
  items.push(newItem);
  await saveMenuItems(items);
  return newItem;
}

export async function addNewMenuItem(
  payload: Partial<MenuItem>
): Promise<{ success: boolean; item?: MenuItem; error?: string }> {
  if (!payload.name || typeof payload.name !== "string" || payload.name.trim().length < 2) {
    return { success: false, error: "Dish name must be at least 2 characters." };
  }

  const price = Number(payload.price);
  if (!price || price <= 0) {
    return { success: false, error: "Please enter a valid price greater than 0." };
  }

  const newItem = await addMenuItem({
    name: payload.name.trim(),
    description: payload.description?.trim() || "Handcrafted artisanal specialty dish.",
    category: payload.category?.trim() || "Pizza",
    price,
    image:
      payload.image?.trim() ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: Boolean(payload.isVeg),
    rating: 5.0,
    prepTime: "15 min",
  });

  return { success: true, item: newItem };
}

export async function updateMenuItem(
  id: number,
  updates: Partial<MenuItem>
): Promise<MenuItem | null> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const updated = await prisma.menuItem.update({
        where: { id },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.description && { description: updates.description }),
          ...(updates.category && { category: updates.category }),
          ...(updates.price !== undefined && { price: Number(updates.price) }),
          ...(updates.image && { image: updates.image }),
          ...(updates.available !== undefined && { available: updates.available }),
          ...(updates.isVeg !== undefined && { isVeg: updates.isVeg }),
          ...(updates.prepTime && { prepTime: updates.prepTime }),
          ...(updates.badge !== undefined && { badge: updates.badge }),
        },
      });
      return {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        category: updated.category,
        price: updated.price,
        image: updated.image,
        available: updated.available,
        isVeg: updated.isVeg,
        rating: updated.rating ?? 5.0,
        prepTime: updated.prepTime ?? "15 min",
        badge: updated.badge ?? undefined,
      };
    } catch (e) {
      console.warn("Prisma updateMenuItem fallback:", e);
    }
  }

  const items = await getMenuItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...updates,
    id,
  };
  await saveMenuItems(items);
  return items[index];
}

export async function toggleMenuItemAvailability(id: number): Promise<MenuItem | null> {
  const current = await getMenuItems().then((list) => list.find((it) => it.id === id));
  if (!current) return null;
  return await updateMenuItem(id, { available: !current.available });
}

export async function deleteMenuItem(id: number): Promise<boolean> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      await prisma.menuItem.delete({
        where: { id },
      });
      return true;
    } catch (e) {
      console.warn("Prisma deleteMenuItem fallback:", e);
    }
  }

  const items = await getMenuItems();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;

  await saveMenuItems(filtered);
  return true;
}

// ---------------- ORDER OPERATIONS ----------------
export async function getOrders(statusFilter?: string): Promise<Order[]> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const whereClause =
        statusFilter && statusFilter !== "All"
          ? { status: { equals: statusFilter, mode: "insensitive" as const } }
          : {};

      const dbOrders = await prisma.order.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });

      if (dbOrders.length > 0) {
        return dbOrders.map((o) => ({
          id: o.id,
          customerName: o.customerName,
          mobile: o.mobile,
          email: o.email,
          address: o.address,
          status: o.status as OrderStatus,
          subtotal: o.subtotal,
          tax: o.tax,
          discount: o.discount ?? 0,
          tip: o.tip ?? 0,
          total: o.total,
          notes: o.notes ?? undefined,
          orderType: (o.orderType as Order["orderType"]) || "Delivery",
          paymentMethod: (o.paymentMethod as Order["paymentMethod"]) || "COD",
          paymentStatus: (o.paymentStatus as Order["paymentStatus"]) || "Pending",
          paymentId: o.paymentId ?? undefined,
          couponCode: o.couponCode ?? undefined,
          createdAt: o.createdAt.toISOString(),
          items: o.items.map((it) => ({
            id: it.dishId ?? it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            image: it.image ?? undefined,
          })),
        }));
      }
    } catch (e) {
      console.warn("Prisma getOrders fallback to JSON storage:", e);
    }
  }

  await ensureStorage();
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    const orders: Order[] = JSON.parse(data);
    if (!statusFilter || statusFilter === "All") {
      return orders;
    }
    return orders.filter(
      (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
    );
  } catch {
    return initialOrders;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const o = await prisma.order.findUnique({
        where: { id: id.trim().toUpperCase() },
        include: { items: true },
      });
      if (o) {
        return {
          id: o.id,
          customerName: o.customerName,
          mobile: o.mobile,
          email: o.email,
          address: o.address,
          status: o.status as OrderStatus,
          subtotal: o.subtotal,
          tax: o.tax,
          discount: o.discount ?? 0,
          tip: o.tip ?? 0,
          total: o.total,
          notes: o.notes ?? undefined,
          orderType: (o.orderType as Order["orderType"]) || "Delivery",
          paymentMethod: (o.paymentMethod as Order["paymentMethod"]) || "COD",
          paymentStatus: (o.paymentStatus as Order["paymentStatus"]) || "Pending",
          paymentId: o.paymentId ?? undefined,
          couponCode: o.couponCode ?? undefined,
          createdAt: o.createdAt.toISOString(),
          items: o.items.map((it) => ({
            id: it.dishId ?? it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            image: it.image ?? undefined,
          })),
        };
      }
    } catch (e) {
      console.warn("Prisma getOrderById fallback:", e);
    }
  }

  const orders = await getOrders();
  const order = orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  return order || null;
}

export async function createOrder(
  orderPayload: Omit<Order, "id" | "createdAt" | "status"> & {
    id?: string;
    status?: OrderStatus;
  }
): Promise<Order> {
  const nextId = orderPayload.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const status: OrderStatus = orderPayload.status || (orderPayload.paymentStatus === "Paid" ? "Accepted" : "Pending");
  const createdAt = new Date().toISOString();

  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const created = await prisma.order.create({
        data: {
          id: nextId,
          customerName: orderPayload.customerName,
          mobile: orderPayload.mobile,
          email: orderPayload.email,
          address: orderPayload.address,
          status: status,
          subtotal: orderPayload.subtotal,
          tax: orderPayload.tax,
          discount: orderPayload.discount ?? 0,
          tip: orderPayload.tip ?? 0,
          total: orderPayload.total,
          notes: orderPayload.notes ?? null,
          orderType: orderPayload.orderType,
          paymentMethod: orderPayload.paymentMethod,
          paymentStatus: orderPayload.paymentStatus,
          paymentId: orderPayload.paymentId ?? null,
          couponCode: orderPayload.couponCode ?? null,
          items: {
            create: orderPayload.items.map((it) => ({
              dishId: it.id,
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              image: it.image ?? null,
            })),
          },
        },
        include: { items: true },
      });

      return {
        id: created.id,
        customerName: created.customerName,
        mobile: created.mobile,
        email: created.email,
        address: created.address,
        status: created.status as OrderStatus,
        subtotal: created.subtotal,
        tax: created.tax,
        discount: created.discount,
        tip: created.tip,
        total: created.total,
        notes: created.notes ?? undefined,
        orderType: created.orderType as Order["orderType"],
        paymentMethod: created.paymentMethod as Order["paymentMethod"],
        paymentStatus: created.paymentStatus as Order["paymentStatus"],
        paymentId: created.paymentId ?? undefined,
        couponCode: created.couponCode ?? undefined,
        createdAt: created.createdAt.toISOString(),
        items: created.items.map((it) => ({
          id: it.dishId ?? it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.image ?? undefined,
        })),
      };
    } catch (e) {
      console.warn("Prisma createOrder fallback to JSON storage:", e);
    }
  }

  const orders = await getOrders();
  const newOrder: Order = {
    ...orderPayload,
    id: nextId,
    status,
    createdAt,
  };

  orders.unshift(newOrder);
  await ensureStorage();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return newOrder;
}

export async function processGuestOrder(
  rawInput: Partial<GuestOrderInput>
): Promise<{ success: boolean; order?: Order; error?: string }> {
  // Validate input
  const validation = validateGuestOrderInput(rawInput);
  if (!validation.valid || !validation.data) {
    return { success: false, error: validation.error || "Invalid order details." };
  }

  const data = validation.data;

  // Calculate subtotal
  const subtotal = data.items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  // Apply Coupon Discount if provided
  let discount = 0;
  if (data.couponCode) {
    const couponResult = validateCoupon(data.couponCode, subtotal);
    if (couponResult.valid) {
      discount = couponResult.discount;
    }
  }

  // Pickup discount (5% extra discount for counter pickup)
  if (data.orderType === "Pickup") {
    discount += Math.round(subtotal * 0.05 * 100) / 100;
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = Math.round(discountedSubtotal * 0.05 * 100) / 100;
  const tip = data.tip || 0;
  const total = Math.round((discountedSubtotal + tax + tip) * 100) / 100;

  const paymentStatus = data.paymentStatus || (data.paymentMethod === "COD" ? "Pending" : "Paid");
  const orderStatus: OrderStatus = paymentStatus === "Paid" ? "Accepted" : "Pending";

  const newOrder = await createOrder({
    customerName: data.customerName,
    mobile: data.mobile,
    email: data.email,
    address: data.address || "",
    items: data.items,
    subtotal,
    discount,
    tip,
    tax,
    total,
    notes: data.notes,
    orderType: data.orderType || "Delivery",
    paymentMethod: data.paymentMethod || "COD",
    paymentStatus,
    paymentId: data.paymentId,
    couponCode: data.couponCode,
    status: orderStatus,
  });

  return { success: true, order: newOrder };
}

export async function updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order | null> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const updated = await prisma.order.update({
        where: { id: id.trim().toUpperCase() },
        data: { status: newStatus },
        include: { items: true },
      });
      return {
        id: updated.id,
        customerName: updated.customerName,
        mobile: updated.mobile,
        email: updated.email,
        address: updated.address,
        status: updated.status as OrderStatus,
        subtotal: updated.subtotal,
        tax: updated.tax,
        discount: updated.discount,
        tip: updated.tip,
        total: updated.total,
        notes: updated.notes ?? undefined,
        orderType: updated.orderType as Order["orderType"],
        paymentMethod: updated.paymentMethod as Order["paymentMethod"],
        paymentStatus: updated.paymentStatus as Order["paymentStatus"],
        paymentId: updated.paymentId ?? undefined,
        couponCode: updated.couponCode ?? undefined,
        createdAt: updated.createdAt.toISOString(),
        items: updated.items.map((it) => ({
          id: it.dishId ?? it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.image ?? undefined,
        })),
      };
    } catch (e) {
      console.warn("Prisma updateOrderStatus fallback:", e);
    }
  }

  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  orders[index].status = newStatus;
  await ensureStorage();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return orders[index];
}

// ---------------- RESERVATION OPERATIONS ----------------
export async function getReservations(): Promise<Reservation[]> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const resList = await prisma.reservation.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (resList.length > 0) {
        return resList.map((r) => ({
          id: r.id,
          customerName: r.customerName,
          mobile: r.mobile,
          email: r.email,
          guests: r.guests,
          date: r.date,
          timeSlot: r.timeSlot,
          seatingArea: r.seatingArea as Reservation["seatingArea"],
          specialRequests: r.specialRequests ?? undefined,
          status: r.status as Reservation["status"],
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("Prisma getReservations fallback:", e);
    }
  }

  await ensureStorage();
  try {
    const data = await fs.readFile(RESERVATIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return initialReservations;
  }
}

export async function createReservation(
  payload: Omit<Reservation, "id" | "createdAt" | "status">
): Promise<Reservation> {
  const nextId = `RES-${Math.floor(200 + Math.random() * 800)}`;
  const createdAt = new Date().toISOString();

  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const created = await prisma.reservation.create({
        data: {
          id: nextId,
          customerName: payload.customerName,
          mobile: payload.mobile,
          email: payload.email,
          guests: payload.guests,
          date: payload.date,
          timeSlot: payload.timeSlot,
          seatingArea: payload.seatingArea,
          specialRequests: payload.specialRequests ?? null,
          status: "Confirmed",
        },
      });
      return {
        id: created.id,
        customerName: created.customerName,
        mobile: created.mobile,
        email: created.email,
        guests: created.guests,
        date: created.date,
        timeSlot: created.timeSlot,
        seatingArea: created.seatingArea as Reservation["seatingArea"],
        specialRequests: created.specialRequests ?? undefined,
        status: created.status as Reservation["status"],
        createdAt: created.createdAt.toISOString(),
      };
    } catch (e) {
      console.warn("Prisma createReservation fallback:", e);
    }
  }

  const reservations = await getReservations();
  const newReservation: Reservation = {
    ...payload,
    id: nextId,
    status: "Confirmed",
    createdAt,
  };

  reservations.unshift(newReservation);
  await ensureStorage();
  await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), "utf-8");
  return newReservation;
}

export async function processGuestReservation(
  rawInput: Partial<GuestReservationInput>
): Promise<{ success: boolean; reservation?: Reservation; error?: string }> {
  const validation = validateGuestReservationInput(rawInput);
  if (!validation.valid || !validation.data) {
    return { success: false, error: validation.error || "Invalid booking details." };
  }

  const data = validation.data;

  const newReservation = await createReservation({
    customerName: data.customerName,
    mobile: data.mobile,
    email: data.email,
    guests: data.guests,
    date: data.date,
    timeSlot: data.timeSlot,
    seatingArea: (data.seatingArea as Reservation["seatingArea"]) || "Indoor Dining",
    specialRequests: data.specialRequests,
  });

  return { success: true, reservation: newReservation };
}

export async function updateReservationStatus(
  id: string,
  status: "Confirmed" | "Seated" | "Cancelled"
): Promise<Reservation | null> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const updated = await prisma.reservation.update({
        where: { id: id.trim().toUpperCase() },
        data: { status },
      });
      return {
        id: updated.id,
        customerName: updated.customerName,
        mobile: updated.mobile,
        email: updated.email,
        guests: updated.guests,
        date: updated.date,
        timeSlot: updated.timeSlot,
        seatingArea: updated.seatingArea as Reservation["seatingArea"],
        specialRequests: updated.specialRequests ?? undefined,
        status: updated.status as Reservation["status"],
        createdAt: updated.createdAt.toISOString(),
      };
    } catch (e) {
      console.warn("Prisma updateReservationStatus fallback:", e);
    }
  }

  const reservations = await getReservations();
  const index = reservations.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  reservations[index].status = status;
  await ensureStorage();
  await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), "utf-8");
  return reservations[index];
}

// ---------------- REVIEW OPERATIONS ----------------
export async function getReviews(): Promise<CustomerReview[]> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const dbReviews = await prisma.customerReview.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (dbReviews.length > 0) {
        return dbReviews.map((r) => ({
          id: r.id,
          name: r.name,
          role: r.role,
          rating: r.rating,
          comment: r.comment,
          avatar: r.avatar ?? undefined,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("Prisma getReviews fallback:", e);
    }
  }

  await ensureStorage();
  try {
    const data = await fs.readFile(REVIEWS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return initialReviews;
  }
}

export async function createReview(
  payload: Omit<CustomerReview, "id" | "createdAt">
): Promise<CustomerReview> {
  const nextId = `REV-${Date.now().toString(36)}`;

  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const created = await prisma.customerReview.create({
        data: {
          id: nextId,
          name: payload.name,
          role: payload.role,
          rating: payload.rating,
          comment: payload.comment,
          avatar: payload.avatar ?? null,
        },
      });
      return {
        id: created.id,
        name: created.name,
        role: created.role,
        rating: created.rating,
        comment: created.comment,
        avatar: created.avatar ?? undefined,
        createdAt: created.createdAt.toISOString(),
      };
    } catch (e) {
      console.warn("Prisma createReview fallback:", e);
    }
  }

  const reviews = await getReviews();
  const newReview: CustomerReview = {
    ...payload,
    id: nextId,
    createdAt: new Date().toISOString(),
  };

  reviews.unshift(newReview);
  await ensureStorage();
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
  return newReview;
}

// ---------------- COUPON VALIDATION ----------------
export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
  const found = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!found) {
    return { valid: false, discount: 0, message: `Promo code "${code}" is invalid or expired.` };
  }
  if (subtotal < found.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Promo code "${found.code}" requires a minimum order of ₹${found.minOrder}.`,
    };
  }

  let discount = 0;
  if (found.discountPercent) {
    discount = Math.round((subtotal * (found.discountPercent / 100)) * 100) / 100;
  } else if (found.discountFixed) {
    discount = found.discountFixed;
  }

  return {
    valid: true,
    discount,
    message: `Promo code "${found.code}" applied! You saved ₹${discount.toFixed(2)}.`,
  };
}
