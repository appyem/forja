import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <h1 className="text-6xl font-extrabold text-brand-purple-900">404</h1>
      <p className="mt-4 text-xl font-semibold text-brand-neutral-600">
        Producto no encontrado
      </p>
      <p className="mt-2 text-sm text-brand-neutral-500">
        Es posible que el producto haya sido retirado o la URL sea incorrecta.
      </p>
      <Link
        href="/catalogo"
        className="mt-6 inline-flex items-center rounded-xl bg-brand-purple-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-purple-800"
      >
        Volver al catálogo
      </Link>
    </section>
  );
}
