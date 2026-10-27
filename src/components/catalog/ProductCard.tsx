import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react"; // ✅ Clock agregado correctamente
import type { Product } from "@/lib/types";
import { formatCOP, getFinalPrice, getDiscountPercentage } from "@/lib/utils/format";
import { AddToCartButton } from "@/components/cart/AddToCartButton"; // ✅ Usamos el botón inteligente

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const finalPrice = getFinalPrice(product.price, product.promotionalPrice);
  const discount = getDiscountPercentage(product.price, product.promotionalPrice);
  const mainImage = product.images[0] || "/logo_final.jpeg";
  const isPreOrder = product.stock <= 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-soft">
      {/* Imagen */}
      <Link
        href={`/producto/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-brand-neutral-100"
        aria-label={`Ver detalles de ${product.name}`}
      >
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Badge de descuento */}
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-pink-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
            -{discount}%
          </span>
        )}

        {/* Badge de bajo pedido */}
        {isPreOrder && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-neutral-800/90 px-2.5 py-1 text-xs font-semibold text-white shadow-md flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Bajo pedido (5-7 días)
          </span>
        )}
      </Link>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/producto/${product.slug}`} className="group/title">
          <h3 className="line-clamp-2 text-sm font-semibold text-brand-purple-900 transition group-hover/title:text-brand-pink-500">
            {product.name}
          </h3>
        </Link>

        {/* Precios */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-purple-900">
            {formatCOP(finalPrice)}
          </span>
          {discount && (
            <span className="text-sm text-brand-neutral-400 line-through">
              {formatCOP(product.price)}
            </span>
          )}
        </div>

        {/* Stock disponible */}
        {!isPreOrder && product.stock <= 5 && (
          <p className="mt-1 text-xs font-medium text-brand-pink-600">
            ¡Solo {product.stock} disponibles!
          </p>
        )}

        {/* ✅ Botón unificado que maneja "Agregar" o "Bajo pedido" automáticamente */}
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}