"use client";

import { useCart } from "@/lib/cart-context";
import { ScrollText, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Mock drinks data
const mockDrinks = [
  {
    id: "1",
    name: "豆漿",
    description: "新鮮製作的豆漿，可熱飲或冷飲。250 卡路里。",
    price: 2.50,
    image: "/images/soymilk.jpg",
    category: "DRINK",
  },
  {
    id: "2",
    name: "蛋餅",
    description: "各種口味餡料的蛋餅。350 卡路里。",
    price: 4.00,
    image: "/images/omelet.jpg",
    category: "MAIN",
  },
  {
    id: "3",
    name: "飯糰",
    description: "美味餡料的糯米卷。450 卡路里。",
    price: 5.50,
    image: "/images/rice ball.jpg",
    category: "MAIN",
  },
  {
    id: "4",
    name: "珍珠奶茶",
    description: "滑順珍珠奶茶。350 卡路里。",
    price: 5.50,
    image: "/images/Bubble Tea.jpg",
    category: "DRINK",
  },
  {
    id: "5",
    name: "冰咖啡",
    description: "濃郁冰咖啡。80 卡路里。",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop",
    category: "DRINK",
  },
  {
    id: "6",
    name: "檸檬茶",
    description: "清爽檸檬茶。120 卡路里。",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop",
    category: "DRINK",
  },
];

export default function Home() {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState("popular");

  // Get quantity for a product from cart
  const getItemQuantity = (productId: string) => {
    const cartItem = cartItems?.find((item: any) => item.id === productId);
    return cartItem?.quantity || 0;
  };

  // Handle quantity change
  const handleQuantityChange = (product: any, newQuantity: number) => {
    const currentQuantity = getItemQuantity(product.id);

    if (currentQuantity === 0 && newQuantity > 0) {
      addItem({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        calories: 0,
        image: product.image,
        quantity: newQuantity,
      });
    } else if (newQuantity === 0) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <div className="flex-1 flex flex-col gap-8 px-4 pt-8 pb-6 max-w-md mx-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#333333]">
            飲料點單系統
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/orders")}
              className="p-0.5 hover:opacity-70 transition-opacity"
              aria-label="View orders"
            >
              <ScrollText className="w-6 h-6 text-[#1e293b]" />
            </button>
            <button
              onClick={() => router.push("/cart")}
              className="relative p-0.5 hover:opacity-70 transition-opacity"
              aria-label="View cart"
            >
              <ShoppingCart className="w-6 h-6 text-[#1e293b]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ed9c2a] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Category Navigation */}
        <nav className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {[
            { id: "popular", label: "最熱門", icon: "🔥" },
            { id: "dinner", label: "晚餐", icon: "🌙" },
            { id: "breakfast", label: "早餐", icon: "☀️" },
            { id: "drinks", label: "飲料", icon: "🥤" },
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeCategory === category.id
                  ? "bg-[#ed9c2a] text-white"
                  : "bg-[#f8f3ec] text-[#333333]"
              }`}
            >
              <span className="text-base">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </nav>

        {/* Drinks List */}
        <div className="flex-1 flex flex-col gap-6">
          {mockDrinks.map((product) => {
            const quantity = getItemQuantity(product.id);
            return (
              <article
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-50 p-4"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div
                    className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url('${product.image}')` }}
                  />

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-[#333333]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#666666] leading-5">
                      {product.description}
                    </p>

                    {/* Price and Quantity Control */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <span className="text-lg font-bold text-[#333333]">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(product, Math.max(0, quantity - 1))
                          }
                          className="w-8 h-8 rounded-full bg-[#f8f3ec] flex items-center justify-center text-[#333333] font-semibold hover:bg-[#efe5d5] active:bg-[#e6dcc5] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-base font-medium text-[#333333] w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product, quantity + 1)}
                          className="w-8 h-8 rounded-full bg-[#f8f3ec] flex items-center justify-center text-[#333333] font-semibold hover:bg-[#efe5d5] active:bg-[#e6dcc5] transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Total Section */}
          <div className="bg-[#f8f3ec] rounded-3xl p-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#333333]">總計</span>
              <span className="text-base font-bold text-[#333333]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
