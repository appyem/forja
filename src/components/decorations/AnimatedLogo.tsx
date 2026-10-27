"use client";

import Image from "next/image";

export function AnimatedLogo() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Halo pulsante de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-80 w-80 rounded-full bg-brand-pink-500/30 blur-3xl animate-pulse-slow" />
      </div>
      
      {/* Segundo halo más pequeño e intenso */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-64 w-64 rounded-full bg-brand-purple-400/40 blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Logo con levitación y contenedor 3D */}
      <div className="relative z-10 animate-float-logo">
        <div className="relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-pink-500 via-brand-purple-600 to-brand-purple-900 shadow-2xl shadow-brand-pink-500/40 ring-4 ring-white/20">
          {/* Brillo superior para efecto 3D */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
          
          {/* Reflejo inferior */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Logo */}
          <Image
            src="/logo_final.jpeg"
            alt="FORJA Logo"
            width={288}
            height={288}
            className="relative z-10 h-64 w-64 rounded-full object-cover"
            priority
          />
        </div>
      </div>

      {/* Sombra dinámica debajo del logo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-10 bg-black/40 rounded-full blur-xl animate-shadow-pulse" />
    </div>
  );
}