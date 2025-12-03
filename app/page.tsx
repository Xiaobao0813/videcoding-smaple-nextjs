import { prisma } from "@/lib/db/prisma";
import HomeClient from "./home-client-new";

export default async function Home() {
  // Fetch all available products from database
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Decimal to number for client component
  const productsForClient = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return <HomeClient products={productsForClient} />;
}
