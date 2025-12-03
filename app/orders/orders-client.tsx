"use client";

import { ChevronDown, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  total: number;
  status: string;
  paymentMethod: string;
  estimatedTime: number | null;
  createdAt: string;
  items: OrderItem[];
}

interface OrdersClientProps {
  orders: Order[];
}

export default function OrdersClient({ orders }: OrdersClientProps) {
  const router = useRouter();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day}    ${hours}:${minutes}`;
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "待付款",
      CONFIRMED: "已確認",
      PREPARING: "準備中",
      READY: "已完成",
      DELIVERED: "已送達",
      CANCELLED: "已取消",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-8 max-w-md mx-auto w-full">
        <button
          onClick={() => router.push("/")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="返回首頁"
        >
          <ChevronLeft className="w-6 h-6 text-[#333333]" />
        </button>
        <h1 className="text-xl font-bold text-[#333333]">訂單紀錄</h1>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </header>

      {/* Orders List */}
      <main className="flex-1 px-4 pb-8 pt-12 max-w-md mx-auto w-full">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-base text-[#666666] text-center mb-2">
              尚無訂單紀錄
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 bg-[#ed9c2a] text-white font-bold text-base py-3 px-6 rounded-full hover:bg-[#d88a24] transition-colors"
            >
              開始點餐
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#f8f3ec] rounded-2xl p-4 transition-all"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-[#666666] leading-5">
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="text-xs text-[#666666] mt-1">
                      訂單編號: {order.orderNumber}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-base font-bold text-[#333333]">
                    ${order.total.toFixed(2)}
                  </span>
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#efe5d5] rounded transition-colors"
                    aria-label="展開訂單詳情"
                  >
                    <ChevronDown
                      className={`w-5 h-5 text-[#666666] transition-transform ${
                        expandedOrderId === order.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Expanded Order Details */}
                {expandedOrderId === order.id && (
                  <div className="mt-4 pt-4 border-t border-[#f2e6d9] space-y-3">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm text-[#333333] font-medium">
                              {item.productName}
                            </span>
                            <span className="text-xs text-[#666666]">
                              x {item.quantity} @ ${item.price.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-sm text-[#333333] font-semibold">
                            ${item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="pt-3 border-t border-[#f2e6d9] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#666666]">小計</span>
                        <span className="text-xs text-[#666666]">
                          ${order.subtotal.toFixed(2)}
                        </span>
                      </div>
                      {order.estimatedTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#666666]">
                            預計準備時間
                          </span>
                          <span className="text-xs text-[#666666]">
                            {order.estimatedTime} 分鐘
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-[#f2e6d9]">
                        <span className="text-sm font-bold text-[#333333]">
                          總計
                        </span>
                        <span className="text-sm font-bold text-[#333333]">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
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
