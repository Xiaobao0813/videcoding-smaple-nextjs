"use client";

import { useCart } from "@/lib/cart-context";
import { ScrollText, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  nameZh: string | null;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isPopular: boolean;
}

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState("popular");

  // Get quantity for a product from cart
  const getItemQuantity = (productId: string) => {
    const cartItem = cartItems?.find((item: any) => item.id === productId);
    return cartItem?.quantity || 0;
  };

  // Handle quantity change
  const handleQuantityChange = (product: Product, newQuantity: number) => {
    const currentQuantity = getItemQuantity(product.id);

    if (currentQuantity === 0 && newQuantity > 0) {
      addItem({
        id: product.id,
        name: product.nameZh || product.name,
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
      <div className="flex-1 flex flex-col gap-8 px-4 pt-8 pb-6 w-full max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#333333]">
            阿寶早餐點單系統
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

        {/* Products Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const quantity = getItemQuantity(product.id);
            return (
              <article
                key={product.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-50 p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex flex-col gap-4">
                  {/* Product Image */}
                  <div
                    className="w-full h-48 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url('${product.image}')` }}
                  />

                  {/* Product Info */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-[#333333]">
                      {product.nameZh || product.name}
                    </h3>
                    <p className="text-sm text-[#666666] leading-5 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price and Quantity Control */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xl font-bold text-[#333333]">
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
        </div>

        {/* Total Section */}
        <div className="bg-[#f8f3ec] rounded-3xl p-4 lg:max-w-xs lg:ml-auto">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-[#333333]">總計</span>
            <span className="text-base font-bold text-[#333333]">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
