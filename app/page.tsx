import { prisma } from "@/lib/db/prisma";
import HomeClient from "./home-client";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Transform Prisma data to match the expected format
  const transformedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.image,
    category: product.category,
  }));

  return <HomeClient products={transformedProducts} />;
}
