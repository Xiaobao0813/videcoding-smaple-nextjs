import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/orders/[orderId]
 * 根據訂單 ID 查詢訂單詳情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "找不到該訂單" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        subtotal: order.subtotal.toString(),
        total: order.total.toString(),
        items: order.items.map((item) => ({
          ...item,
          price: item.price.toString(),
          subtotal: item.subtotal.toString(),
        })),
      },
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

/**
 * PATCH /api/orders/[orderId]
 * 更新訂單狀態
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { status } = body;

    // 驗證狀態值
    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "無效的訂單狀態" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
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
      order: {
        ...order,
        subtotal: order.subtotal.toString(),
        total: order.total.toString(),
      },
    });
  } catch (error) {
    console.error("更新訂單失敗:", error);
    return NextResponse.json(
      {
        error: "更新訂單失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 },
    );
  }
}
