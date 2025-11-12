"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Soy Milk",
      description: "Freshly made soy milk, served hot or cold.",
      price: 2.0,
      calories: 250,
      image:
        "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=400&h=400&fit=crop",
      quantity: 2,
    },
    {
      id: "2",
      name: "Egg Crepe",
      description: "Egg crepe with a variety of fillings.",
      price: 3.5,
      calories: 350,
      image:
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop",
      quantity: 1,
    },
    {
      id: "3",
      name: "Radish Cake",
      description: "Pan-fried radish cake, crispy outside.",
      price: 3.0,
      calories: 320,
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop",
      quantity: 1,
    },
    {
      id: "4",
      name: "Fried Dough Stick",
      description: "Traditional Chinese fried dough.",
      price: 2.0,
      calories: 280,
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop",
      quantity: 1,
    },
  ]);

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
      removeItem(id);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
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
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
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
