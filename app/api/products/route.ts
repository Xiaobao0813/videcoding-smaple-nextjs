import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    let products;

    if (category === "popular") {
      // Fetch popular products
      products = await prisma.product.findMany({
        where: {
          isAvailable: true,
          isPopular: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    } else if (category === "breakfast" || category === "dinner") {
      // For breakfast/dinner, show main dishes and sides
      products = await prisma.product.findMany({
        where: {
          isAvailable: true,
          category: {
            in: ["MAIN", "SIDE"],
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    } else if (category === "drinks") {
      // Fetch drinks
      products = await prisma.product.findMany({
        where: {
          isAvailable: true,
          category: "DRINK",
        },
        orderBy: {
          name: "asc",
        },
      });
    } else {
      // Default: fetch all products
      products = await prisma.product.findMany({
        where: {
          isAvailable: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    }

    // Transform Prisma data to match the expected format
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      image: product.image,
      category: product.category,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
