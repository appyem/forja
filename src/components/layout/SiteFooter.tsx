import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-brand-neutral-200 bg-brand-purple-950 text-brand-neutral-200">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Image
            src="/logo_final.jpeg"
            alt="FORJA Logo"
            width={120}
            height={48}
            className="h-12 w-auto object-contain"
          />
          <p className="mt-3 text-sm text-brand-neutral-300">
            Forjando mujeres más fuertes cada día. Equipamiento deportivo de calidad en Colombia.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Tienda</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/catalogo" className="hover:text-brand-pink-400 transition">Catálogo</Link></li>
            <li><Link href="/catalogo?cat=balones" className="hover:text-brand-pink-400 transition">Balones</Link></li>
            <li><Link href="/catalogo?cat=pesas" className="hover:text-brand-pink-400 transition">Pesas</Link></li>
            <li><Link href="/personalizar" className="hover:text-brand-pink-400 transition">Personalizar</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Ayuda</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/envios" className="hover:text-brand-pink-400 transition">Envíos</Link></li>
            <li><Link href="/devoluciones" className="hover:text-brand-pink-400 transition">Devoluciones</Link></li>
            <li><Link href="/preguntas" className="hover:text-brand-pink-400 transition">Preguntas frecuentes</Link></li>
            <li><Link href="/contacto" className="hover:text-brand-pink-400 transition">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/terminos" className="hover:text-brand-pink-400 transition">Términos</Link></li>
            <li><Link href="/privacidad" className="hover:text-brand-pink-400 transition">Privacidad</Link></li>
            <li><Link href="/cookies" className="hover:text-brand-pink-400 transition">Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-brand-neutral-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 FORJA. Todos los derechos reservados.</p>
          <p>Hecho en Colombia 🇨🇴</p>
        </div>
      </div>
    </footer>
  );
}