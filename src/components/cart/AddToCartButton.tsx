"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Pick<Product, "id" | "name" | "price" | "promotionalPrice" | "stock" | "images" | "sku">;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;

    // Calculamos el precio final (promocional si existe y es válido)
    const finalPrice = product.promotionalPrice && product.promotionalPrice > 0 
      ? product.promotionalPrice 
      : product.price;

    const cartItem = {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: finalPrice,
      quantity: 1,
      image: product.images[0] || "/logo_final.jpeg",
    };

    addItem(cartItem, product.stock);
    setIsAdded(true);
    
    // Resetear el estado visual después de 2 segundos
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-brand-neutral-300 ${
        isAdded ? "bg-green-500 hover:bg-green-600" : "bg-brand-purple-900 hover:bg-brand-purple-800"
      }`}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4" />
          ¡Agregado!
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {isOutOfStock ? "Sin stock" : "Agregar"}
        </>
      )}
    </button>
  );
}