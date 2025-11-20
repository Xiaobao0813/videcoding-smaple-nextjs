"use client";

import { useCart } from "@/lib/cart-context";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, reorder } = useCart();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleReorder = (orderId: string) => {
    reorder(orderId);
    router.push("/cart");
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day}    ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-8 max-w-md mx-auto w-full">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-[#333333]" />
        </button>
        <h1 className="text-xl font-bold text-[#333333]">Order History</h1>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </header>

      {/* Orders List */}
      <main className="flex-1 px-4 pb-8 pt-12 max-w-md mx-auto w-full">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-base text-[#666666] text-center">
              No orders yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#f8f3ec] rounded-2xl p-4 transition-all"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between py-1">
                  <span className="text-sm text-[#666666] leading-5">
                    {formatDate(order.createdAt)}
                  </span>
                  <button
                    onClick={() => handleReorder(order.id)}
                    className="bg-[#ed9c2a] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#d88a24] transition-colors"
                  >
                    Reorder
                  </button>
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-[#666666] leading-5">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-6 h-6 flex items-center justify-center hover:bg-[#efe5d5] rounded transition-colors"
                  >
                    <ChevronDown
                      className={`w-6 h-6 text-[#666666] transition-transform ${
                        expandedOrderId === order.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Expanded Order Details */}
                {expandedOrderId === order.id && (
                  <div className="mt-4 pt-4 border-t border-[#f2e6d9] space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#666666]">
                        Order {order.orderNumber}
                      </span>
                    </div>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-1"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm text-[#333333] font-medium">
                            {item.name}
                          </span>
                          <span className="text-xs text-[#666666]">
                            x {item.quantity}
                          </span>
                        </div>
                        <span className="text-sm text-[#333333] font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
