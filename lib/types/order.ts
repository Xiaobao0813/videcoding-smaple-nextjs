/**
 * 訂單相關的 TypeScript 類型定義
 * 這些類型對應 Prisma Schema 中的模型
 */

// 訂單狀態
export type OrderStatus =
  | "PENDING" // 待付款
  | "CONFIRMED" // 已確認
  | "PREPARING" // 準備中
  | "READY" // 已完成
  | "DELIVERED" // 已送達
  | "CANCELLED"; // 已取消

// 付款方式類型
export type PaymentMethodType =
  | "CREDIT_CARD"
  | "MASTERCARD"
  | "VISA"
  | "APPLE_PAY";

// 產品分類
export type ProductCategory = "DRINK" | "MAIN" | "SIDE";

// 訂單項目介面
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: string | number; // Decimal 在 JSON 中會轉為 string
  subtotal: string | number;
  createdAt: Date | string;
}

// 訂單介面
export interface Order {
  id: string;
  orderNumber: string;
  subtotal: string | number;
  total: string | number;
  status: OrderStatus;
  paymentMethod: PaymentMethodType;
  estimatedTime?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId?: string | null;
  items?: OrderItem[];
}

// 建立訂單請求
export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: PaymentMethodType;
  userId?: string;
}

// 建立訂單回應
export interface CreateOrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
  details?: string;
}

// 查詢訂單回應
export interface GetOrderResponse {
  success: boolean;
  order?: Order;
  orders?: Order[];
  error?: string;
  details?: string;
}

// 更新訂單狀態請求
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// 訂單狀態中文對照
export const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
  PENDING: "待付款",
  CONFIRMED: "已確認",
  PREPARING: "準備中",
  READY: "已完成",
  DELIVERED: "已送達",
  CANCELLED: "已取消",
};

// 付款方式中文對照
export const PAYMENT_METHOD_TEXT: Record<PaymentMethodType, string> = {
  CREDIT_CARD: "信用卡",
  MASTERCARD: "Mastercard",
  VISA: "Visa",
  APPLE_PAY: "Apple Pay",
};
