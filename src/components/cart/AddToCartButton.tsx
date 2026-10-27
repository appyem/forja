"use client";

import { useState } from "react";
import { ShoppingBag, Check, Clock } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Pick<Product, "id" | "name" | "price" | "promotionalPrice" | "stock" | "images" | "sku">;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  
  // ✅ Stock 0 ahora significa "Bajo pedido", no "Deshabilitado"
  const isPreOrder = product.stock <= 0;

  const handleAdd = () => {
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

    addItem(cartItem, product.stock); // El store ahora maneja el stock 0 correctamente
    setIsAdded(true);
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white transition ${
        isAdded 
          ? "bg-green-500 hover:bg-green-600" 
          : isPreOrder 
            ? "bg-brand-neutral-600 hover:bg-brand-neutral-700" // Color diferente para bajo pedido
            : "bg-brand-purple-900 hover:bg-brand-purple-800"
      }`}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4" />
          ¡Agregado!
        </>
      ) : (
        <>
          {isPreOrder ? <Clock className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
          {isPreOrder ? "Pedir (Entrega 5-7 días)" : "Agregar"}
        </>
      )}
    </button>
  );
}