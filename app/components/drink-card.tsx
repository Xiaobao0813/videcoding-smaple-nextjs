"use client";

import { useCart } from "@/lib/cart-context";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

interface DrinkCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function DrinkCard({
  id,
  name,
  price,
  image,
  description,
}: DrinkCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id,
      name,
      price,
      image,
      description,
      quantity: 1,
      calories: 0,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col gap-3">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xl font-bold text-orange-500">
            ${price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
