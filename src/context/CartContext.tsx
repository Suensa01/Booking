"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CartItem, MenuItem } from "@/types";
import { useToast } from "./ToastContext";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  isCartOpen: boolean;
  isHydrated: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: MenuItem | CartItem, quantity?: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
}

const CART_STORAGE_KEY = "savoria_cart_data_v1";
const TAX_RATE = 0.05; // 5%

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  // Load from localStorage safely after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          queueMicrotask(() => {
            setItems(parsed);
          });
        }
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to storage", e);
      }
    }
  }, [items, isHydrated]);

  const addToCart = useCallback(
    (item: MenuItem | CartItem, quantity: number = 1) => {
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((i) => i.id === item.id);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };
          return updated;
        } else {
          const newItem: CartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: quantity,
            isVeg: item.isVeg,
            category: item.category,
          };
          return [...prevItems, newItem];
        }
      });

      showToast(`Added "${item.name}" to cart`, "success");
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (id: number, delta: number) => {
      const existing = items.find((i) => i.id === id);
      if (existing && existing.quantity + delta <= 0) {
        showToast(`Removed "${existing.name}" from cart`, "info");
      }

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((i) => i.id === id);
        if (existingIndex === -1) return prevItems;

        const currentQty = prevItems[existingIndex].quantity;
        const targetQty = currentQty + delta;

        if (targetQty <= 0) {
          return prevItems.filter((i) => i.id !== id);
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: targetQty,
        };
        return updated;
      });
    },
    [items, showToast]
  );

  const removeFromCart = useCallback(
    (id: number) => {
      const existing = items.find((i) => i.id === id);
      if (existing) {
        showToast(`Removed "${existing.name}" from cart`, "info");
      }
      setItems((prevItems) => prevItems.filter((i) => i.id !== id));
    },
    [items, showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const getItemQuantity = useCallback(
    (id: number) => {
      const item = items.find((i) => i.id === id);
      return item ? item.quantity : 0;
    },
    [items]
  );

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    const raw = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Math.round(raw * 100) / 100;
  }, [items]);

  const tax = useMemo(() => {
    return Math.round(subtotal * TAX_RATE * 100) / 100;
  }, [subtotal]);

  const total = useMemo(() => {
    return Math.round((subtotal + tax) * 100) / 100;
  }, [subtotal, tax]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      tax,
      total,
      isCartOpen,
      isHydrated,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getItemQuantity,
    }),
    [
      items,
      itemCount,
      subtotal,
      tax,
      total,
      isCartOpen,
      isHydrated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
