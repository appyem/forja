import type { Metadata } from "next";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getActiveProducts, getProductsByCategory } from "@/services/products";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora todos los productos FORJA: balones personalizados, pesas y mancuernas ergonómicas.",
};

interface CatalogPageProps {
  searchParams: Promise<{ cat?: string; q?: string }>;
}

const CATEGORIES = [
  { id: "todas", name: "Todas" },
  { id: "balones", name: "Balones" },
  { id: "pesas", name: "Pesas" },
];

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const categoryFilter = params.cat ?? "todas";
  const searchQuery = (params.q ?? "").toLowerCase().trim();

  const products =
    categoryFilter === "todas"
      ? await getActiveProducts()
      : await getProductsByCategory(categoryFilter);

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery)
      )
    : products;

  const activeCategory = CATEGORIES.find((c) => c.id === categoryFilter) ?? CATEGORIES[0];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-purple-900 sm:text-4xl">
          Catálogo
        </h1>
        <p className="mt-2 text-sm text-brand-neutral-500">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "producto disponible" : "productos disponibles"}
          {activeCategory.id !== "todas" ? ` en ${activeCategory.name}` : ""}
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-brand-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === categoryFilter;
            const href = cat.id === "todas" ? "/catalogo" : `/catalogo?cat=${cat.id}`;
            return (
              <a
                key={cat.id}
                href={href}
                className={
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition " +
                  (isActive
                    ? "bg-brand-purple-900 text-white"
                    : "bg-brand-neutral-100 text-brand-purple-800 hover:bg-brand-neutral-200")
                }
              >
                {cat.name}
              </a>
            );
          })}
        </div>

        <form action="/catalogo" method="GET" className="flex w-full items-center gap-2 sm:w-72">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-neutral-400" />
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Buscar producto..."
              className="w-full rounded-xl border border-brand-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-brand-purple-900 placeholder:text-brand-neutral-400 focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
            />
          </div>
          {categoryFilter !== "todas" && (
            <input type="hidden" name="cat" value={categoryFilter} />
          )}
        </form>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-neutral-300 bg-brand-neutral-50 py-16 text-center">
          <p className="text-lg font-semibold text-brand-purple-900">
            No encontramos productos
          </p>
          <p className="mt-1 text-sm text-brand-neutral-500">
            Intenta con otra categoría o término de búsqueda.
          </p>
          <a
            href="/catalogo"
            className="mt-4 inline-flex items-center rounded-xl bg-brand-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink-600"
          >
            Ver todos los productos
          </a>
        </div>
      )}
    </section>
  );
}