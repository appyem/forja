import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, Palette } from "lucide-react";
import { getProductBySlug } from "@/services/products";
import { formatCOP, getFinalPrice, getDiscountPercentage } from "@/lib/utils/format";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const finalPrice = getFinalPrice(product.price, product.promotionalPrice);
  const discount = getDiscountPercentage(product.price, product.promotionalPrice);
  const mainImage = product.images[0] || "/logo-FORJA.png";
  const isOutOfStock = product.stock <= 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb / Volver */}
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-neutral-500 transition hover:text-brand-pink-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Galería de Imágenes */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-neutral-200 bg-brand-neutral-50">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-contain p-4 sm:p-8"
            priority
          />
          {discount && (
            <span className="absolute left-4 top-4 rounded-full bg-brand-pink-500 px-3 py-1.5 text-sm font-bold text-white shadow-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Información del Producto */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-brand-purple-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-purple-900">
              {product.categoryId === "balones" ? "Balones" : "Pesas y Mancuernas"}
            </span>
            {isOutOfStock ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Agotado
              </span>
            ) : product.stock <= 5 ? (
              <span className="rounded-full bg-brand-pink-100 px-3 py-1 text-xs font-semibold text-brand-pink-700">
                ¡Solo {product.stock} disponibles!
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                En stock
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-brand-purple-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brand-neutral-600">
            {product.description}
          </p>

          {/* Precios */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-brand-purple-900">
              {formatCOP(finalPrice)}
            </span>
            {discount && (
              <span className="text-xl text-brand-neutral-400 line-through">
                {formatCOP(product.price)}
              </span>
            )}
          </div>

          {/* Opciones de Personalización */}
          {product.allowsCustomization && (
            <div className="mt-6 rounded-xl border border-brand-pink-200 bg-brand-pink-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-brand-pink-800">
                <Palette className="h-4 w-4" />
                Personalización disponible
              </h3>
              <p className="mt-1 text-sm text-brand-pink-700">
                Este producto admite nombre, número y colores. Las opciones de personalización se habilitarán en el carrito.
              </p>
            </div>
          )}

          {/* Botón de Acción (Componente funcional) */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={product} />
          </div>

          {/* Beneficios rápidos */}
          <div className="mt-8 grid gap-4 border-t border-brand-neutral-200 pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-5 w-5 text-brand-purple-900" />
              <div>
                <p className="text-sm font-semibold text-brand-purple-900">Envío a toda Colombia</p>
                <p className="text-xs text-brand-neutral-500">Despacho en 24-48 horas hábiles.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-brand-purple-900" />
              <div>
                <p className="text-sm font-semibold text-brand-purple-900">Garantía de calidad</p>
                <p className="text-xs text-brand-neutral-500">Productos verificados y seguros.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}