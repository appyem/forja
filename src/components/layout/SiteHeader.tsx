import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, User } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-black text-white shadow-lg">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
  href="/"
  className="flex items-center"
  aria-label="FORJA — inicio"
>
  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-pink-500 via-brand-purple-600 to-brand-purple-900 shadow-lg shadow-brand-pink-500/30 ring-2 ring-white/20 transition-transform hover:scale-105">
    {/* Brillo superior para efecto 3D */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
    
    {/* Logo */}
    <Image
      src="/logo_final.jpeg"
      alt="FORJA"
      width={64}
      height={64}
      className="relative z-10 h-14 w-14 rounded-full object-cover"
      priority
    />
  </div>
</Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-6 text-sm font-semibold text-white md:flex"
        >
          <Link href="/catalogo" className="transition hover:text-brand-pink-400">
            Catálogo
          </Link>
          <Link href="/catalogo?cat=balones" className="transition hover:text-brand-pink-400">
            Balones
          </Link>
          <Link href="/catalogo?cat=pesas" className="transition hover:text-brand-pink-400">
            Pesas
          </Link>
          <Link href="/personalizar" className="transition hover:text-brand-pink-400">
            Personalizar
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Buscar"
            className="rounded-lg p-2 text-white transition hover:bg-white/10"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link
            href="/cuenta"
            aria-label="Mi cuenta"
            className="rounded-lg p-2 text-white transition hover:bg-white/10"
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href="/carrito"
            aria-label="Carrito"
            className="relative rounded-lg p-2 text-white transition hover:bg-white/10"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-pink-500 px-1.5 text-[11px] font-bold text-white">
              0
            </span>
          </Link>
          <button
            type="button"
            aria-label="Abrir menú"
            className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}