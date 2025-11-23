"use client";

import { useCart } from "@/lib/cart-context";
import { ScrollText, ShoppingCart, Coffee, Moon, Sun, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface HomeClientProps {
  products: Product[];
}

interface CartItem {
  id: string;
  quantity: number;
}

export default function HomeClient({ products: initialProducts }: HomeClientProps) {
  const router = useRouter();
  const {
    items: cartItems,
    addItem,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();
  const [activeCategory, setActiveCategory] = useState("popular");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [itemQuantities, setItemQuantities] = useState<{ [key: string]: number }>({});

  // Initialize quantities from cart items
  useEffect(() => {
    const quantities: { [key: string]: number } = {};
    cartItems?.forEach((item: CartItem) => {
      quantities[item.id] = item.quantity;
    });
    setItemQuantities(quantities);
  }, [cartItems]);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products?category=${activeCategory}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  // Get quantity for a product from cart
  const getItemQuantity = (productId: string) => {
    const cartItem = cartItems?.find((item: CartItem) => item.id === productId);
    return cartItem?.quantity || 0;
  };

  // Handle quantity change
  const handleQuantityChange = (product: Product, newQuantity: number) => {
    const currentQuantity = getItemQuantity(product.id);

    if (currentQuantity === 0 && newQuantity > 0) {
      // 商品不在購物車中，需要添加
      addItem({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        calories: 0,
        image: product.image,
        quantity: newQuantity,
      });
    } else if (newQuantity === 0) {
      // 移除商品
      updateQuantity(product.id, 0);
    } else {
      // 商品已在購物車中，更新數量
      updateQuantity(product.id, newQuantity);
    }
  };

  // Category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "popular":
        return "🔥";
      case "dinner":
        return "🌙";
      case "breakfast":
        return "☀️";
      case "drinks":
        return "🥤";
      default:
        return "";
    }
  };

  // Category labels
  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      popular: "Most popular",
      dinner: "Dinner",
      breakfast: "Breakfast",
      drinks: "Drinks",
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col gap-8 px-4 pt-8 pb-6 max-w-md mx-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#333333]">
            Taiwanese Breakfast
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
          {["popular", "dinner", "breakfast", "drinks"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeCategory === category
                  ? "bg-[#ed9c2a] text-white"
                  : "bg-[#f8f3ec] text-[#333333]"
              }`}
            >
              <span className="text-base">{getCategoryIcon(category)}</span>
              {getCategoryLabel(category)}
            </button>
          ))}
        </nav>

        {/* Menu Items Container */}
        <div className="flex-1 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-[#666666]">Loading products...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-[#666666]">No products available</div>
            </div>
          ) : (
            products.map((product) => {
              const quantity = getItemQuantity(product.id);
              return (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div
                      className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 overflow-hidden"
                      style={{ backgroundImage: `url('${product.image}')` }}
                    />
                    
                    {/* Product Info */}
                    <div className="flex-1 flex flex-col gap-1">
                      <h3 className="text-lg font-semibold text-[#333333] line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#666666] leading-5 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Price and Quantity Control */}
                      <div className="flex items-center justify-between mt-3 pt-2">
                        <span className="text-lg font-bold text-[#333333]">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product,
                                Math.max(0, quantity - 1)
                              )
                            }
                            className="w-8 h-8 rounded-full bg-[#f8f3ec] flex items-center justify-center text-[#333333] font-semibold hover:bg-[#efe5d5] active:bg-[#e6dcc5] transition-colors text-base"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="text-base font-medium text-[#333333] w-7 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(product, quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-[#f8f3ec] flex items-center justify-center text-[#333333] font-semibold hover:bg-[#efe5d5] active:bg-[#e6dcc5] transition-colors text-base"
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
            })
          )}

          {/* Total Section */}
          {products.length > 0 && (
            <div className="bg-[#f8f3ec] rounded-3xl p-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#333333]">Total</span>
                <span className="text-base font-bold text-[#333333]">
                  ${Number(totalPrice).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
