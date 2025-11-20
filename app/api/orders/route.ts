import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: "CREDIT_CARD" | "MASTERCARD" | "VISA" | "APPLE_PAY";
  userId?: string;
}

/**
 * POST /api/orders
 * 建立新訂單
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    const { items, paymentMethod, userId } = body;

    // 驗證必要欄位
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "訂單項目不可為空" }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "請選擇付款方式" }, { status: 400 });
    }

    // 計算訂單金額
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = subtotal; // 未來可以加入稅金、運費等

    // 生成訂單編號
    const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`;

    // 建立訂單（使用交易確保資料一致性）
    const order = await prisma.$transaction(async (tx) => {
      // 建立訂單
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          subtotal,
          total,
          paymentMethod,
          userId,
          status: "PENDING",
          estimatedTime: 15 + Math.floor(Math.random() * 6), // 15-20 分鐘
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          subtotal: order.subtotal.toString(),
          total: order.total.toString(),
          status: order.status,
          estimatedTime: order.estimatedTime,
          items: order.items,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("建立訂單失敗:", error);
    return NextResponse.json(
      {
        error: "建立訂單失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/orders?userId=xxx
 * 查詢訂單
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const orderNumber = searchParams.get("orderNumber");

    let orders;

    if (orderNumber) {
      // 根據訂單編號查詢單一訂單
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        order: order
          ? {
              ...order,
              subtotal: order.subtotal.toString(),
              total: order.total.toString(),
            }
          : null,
      });
    } else if (userId) {
      // 根據用戶 ID 查詢所有訂單
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // 查詢所有訂單（可能需要加入分頁和權限控制）
      orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50, // 限制返回數量
      });
    }

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => ({
        ...order,
        subtotal: order.subtotal.toString(),
        total: order.total.toString(),
      })),
    });
  } catch (error) {
    console.error("查詢訂單失敗:", error);
    return NextResponse.json(
      {
        error: "查詢訂單失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 },
    );
  }
}
