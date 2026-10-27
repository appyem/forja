import Link from "next/link";
import Image from "next/image";
import {
  Dumbbell,
  CircleDot,
  Truck,
  ShieldCheck,
  Paintbrush,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { getActiveProducts } from "@/services/products";
import { formatCOP, getFinalPrice, getDiscountPercentage } from "@/lib/utils/format";
import { FloatingBows } from "@/components/decorations/FloatingBows";
import { AnimatedLogo } from "@/components/decorations/AnimatedLogo";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

const categories = [
  {
    slug: "balones",
    name: "Balones y accesorios",
    description: "Diseña tu equipamiento con estilo, nombre y colores únicos.",
    icon: CircleDot,
    href: "/catalogo?cat=balones",
  },
  {
    slug: "pesas",
    name: "Pesas y mancuernas",
    description: "Ergonómicas, resistentes y listas para forjar tu fuerza.",
    icon: Dumbbell,
    href: "/catalogo?cat=pesas",
  },
];

const benefits = [
  {
    icon: Truck,
    title: "Envíos a toda Colombia",
    text: "Despachamos desde Bogotá con aliados logísticos verificados.",
  },
  {
    icon: ShieldCheck,
    title: "Pago seguro",
    text: "Tus datos protegidos. Transacciones 100% verificadas.",
  },
  {
    icon: Paintbrush,
    title: "Personalización real",
    text: "Agrega tu nombre, número y colores favoritos a tu equipo.",
  },
  {
    icon: MessageCircle,
    title: "Atención por WhatsApp",
    text: "Resolvemos tus dudas y cotizaciones al instante.",
  },
];

export default async function HomePage() {
  const allProducts = await getActiveProducts();
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-purple-950 text-white">
        <FloatingBows count={6} className="opacity-20" />
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,61,154,0.3),_transparent_60%)]"
        />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-pink-300">
              <CircleDot className="h-3.5 w-3.5" />
              NUEVA COLECCIÓN FEMENINA
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Forja tu mejor versión.
              <br />
              <span className="text-brand-pink-500">Más fuertes cada día.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-brand-neutral-200 sm:text-lg">
              Equipamiento deportivo diseñado para mujeres que se forjan y se hacen más fuertes cada día. Calidad, estilo y rendimiento con envío a toda Colombia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn-primary">
                Ver catálogo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/personalizar" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Personalizar ahora
              </Link>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center">
            <AnimatedLogo />
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-brand-purple-900 sm:text-3xl">
              Equipamiento para tu entrenamiento
            </h2>
            <p className="mt-1 text-sm text-brand-neutral-500">
              Todo lo que necesitas para rendir al máximo.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="hidden text-sm font-semibold text-brand-pink-500 hover:text-brand-pink-600 sm:inline-flex"
          >
            Ver todo →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl border border-brand-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-purple-900 text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-brand-neutral-400 transition group-hover:translate-x-1 group-hover:text-brand-pink-500" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-brand-purple-900">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-brand-neutral-500">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="bg-brand-neutral-50 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-brand-purple-900 sm:text-3xl">
              Destacados
            </h2>
            <Link
              href="/catalogo"
              className="text-sm font-semibold text-brand-pink-500 hover:text-brand-pink-600"
            >
              Ver todo →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {featuredProducts.map((product) => {
              const finalPrice = getFinalPrice(product.price, product.promotionalPrice);
              const discount = getDiscountPercentage(product.price, product.promotionalPrice);
              const mainImage = product.images[0] || "/logo_final.jpeg";
              const isOutOfStock = product.stock <= 0;

              return (
                <article
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <Link
                    href={`/producto/${product.slug}`}
                    className="relative block aspect-square overflow-hidden bg-brand-neutral-100"
                  >
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    {discount && (
                      <span className="absolute left-3 top-3 rounded-full bg-brand-pink-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                        -{discount}%
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="absolute right-3 top-3 rounded-full bg-brand-neutral-800/90 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                        Agotado
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-4">
                    <Link href={`/producto/${product.slug}`}>
                      <h3 className="line-clamp-2 text-sm font-semibold text-brand-purple-900 transition group-hover:text-brand-pink-500">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-bold text-brand-purple-900 sm:text-lg">
                        {formatCOP(finalPrice)}
                      </span>
                      {discount && (
                        <span className="text-xs text-brand-neutral-400 line-through sm:text-sm">
                          {formatCOP(product.price)}
                        </span>
                      )}
                    </div>

                    {!isOutOfStock && product.stock <= 5 && (
                      <p className="mt-1 text-xs font-medium text-brand-pink-600">
                        ¡Solo {product.stock} disponibles!
                      </p>
                    )}

                    <AddToCartButton product={product} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-brand-purple-900 sm:text-3xl">
          ¿Por qué FORJA?
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-brand-neutral-200 bg-white p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-pink-500/10 text-brand-pink-500">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-brand-purple-900">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm text-brand-neutral-500">{b.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA PERSONALIZACIÓN */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-purple-900 text-white">
          <FloatingBows count={4} className="opacity-10" />
          <div className="relative z-10 grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Entrena con tu propio estilo
              </h2>
              <p className="mt-2 text-brand-neutral-200">
                Personaliza tu equipamiento con los colores y detalles que te representan. Ideal para ti, tu equipo o tu academia.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/personalizar" className="btn-primary">
                  Personalizar ahora
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cotizar por volumen
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Paintbrush className="h-24 w-24 text-brand-pink-500" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}