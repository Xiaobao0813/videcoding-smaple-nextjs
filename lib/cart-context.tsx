"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

export interface CartItem {
  id: string; // 這是產品 ID (productId)
  name: string;
  description: string;
  price: number;
  calories: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  saveOrder: (
    orderNumber: string,
    paymentMethod: "CREDIT_CARD" | "MASTERCARD" | "VISA" | "APPLE_PAY",
  ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  reorder: (orderId: string) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // 預設購物車是空的
  const [items, setItems] = useState<CartItem[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  const addItem = (item: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id);
      if (existingItem) {
        return currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...currentItems, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      // 如果數量為 0 或負數，從購物車移除該商品
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    } else {
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === id);
        if (existingItem) {
          // 更新現有商品的數量
          return currentItems.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          );
        }
        // 如果商品不存在，不做任何事（需要使用 addItem）
        return currentItems;
      });
    }
  };

  const clearCart = () => {
    // 清空購物車
    setItems([]);
  };

  const saveOrder = async (
    orderNumber: string,
    paymentMethod: "CREDIT_CARD" | "MASTERCARD" | "VISA" | "APPLE_PAY",
  ): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    try {
      // 準備訂單資料
      const orderItems = items
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

      if (orderItems.length === 0) {
        return { success: false, error: "購物車是空的" };
      }

      // 呼叫 API 建立訂單
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderItems,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "建立訂單失敗" };
      }

      // 儲存訂單到本地狀態（用於訂單歷史）
      const orderId = crypto.randomUUID();
      const newOrder: Order = {
        id: orderId,
        orderNumber,
        items: [...items],
        totalPrice,
        createdAt: new Date(),
      };
      setOrders((prevOrders) => [newOrder, ...prevOrders]);

      return { success: true, orderId: data.order.id };
    } catch (error) {
      console.error("儲存訂單失敗:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知錯誤",
      };
    }
  };

  const reorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      // Clear current cart and add all items from the order
      setItems([...order.items]);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        orders,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        saveOrder,
        reorder,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
