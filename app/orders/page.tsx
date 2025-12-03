import { prisma } from "@/lib/db/prisma";
import OrdersClient from "./orders-client";

export default async function OrdersPage() {
  // Fetch all orders from database with items
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Decimal to number and Date to string for client component
  const ordersForClient = orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
    })),
  }));

  return <OrdersClient orders={ordersForClient} />;
}
