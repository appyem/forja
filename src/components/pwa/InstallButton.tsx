"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const checkIsIOS = () => {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

const checkIsStandalone = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
};

export function InstallButton() {
  const searchParams = useSearchParams();
  const isDebug = searchParams.get("debug") === "pwa";

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  const [isInstallable, setIsInstallable] = useState(() => {
    if (typeof window === "undefined") return false;
    if (isDebug) return true;
    
    const isIOS = checkIsIOS();
    const isStandalone = checkIsStandalone();
    if (isIOS && !isStandalone) return true;
    return false;
  });
  
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    console.log("🔍 [InstallButton] Montado. isDebug:", isDebug);
    
    if (typeof window === "undefined") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log("✅ [InstallButton] Evento beforeinstallprompt capturado");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isDebug]); // ✅ Dependencia correcta: solo isDebug

  const handleInstallClick = async () => {
    if (checkIsIOS()) {
      setShowIOSInstructions(true);
      return;
    }
    if (!deferredPrompt) {
      console.warn("⚠️ [InstallButton] No hay deferredPrompt disponible.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("✅ App instalada correctamente");
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable) {
    console.log("⛔ [InstallButton] Retornando null (no es instalable)");
    return null;
  }

  if (showIOSInstructions || (isDebug && checkIsIOS())) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-[9999] rounded-2xl border border-brand-neutral-200 bg-white p-5 shadow-2xl md:left-auto md:right-4 md:max-w-sm">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-sm font-bold text-brand-purple-900">Instalar FORJA en tu iPhone</h3>
          <button onClick={() => setShowIOSInstructions(false)} className="text-brand-neutral-400 hover:text-brand-purple-900">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ol className="space-y-3 text-sm text-brand-neutral-600">
          <li className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink-100 text-brand-pink-600 font-bold">1</span>
            <span>Toca el botón <Share className="inline h-4 w-4" /> <strong>Compartir</strong> en la barra inferior.</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink-100 text-brand-pink-600 font-bold">2</span>
            <span>Desplaza hacia abajo y selecciona <strong>&quot;Añadir a pantalla de inicio&quot;</strong>.</span>
          </li>
        </ol>
        <button 
          onClick={() => setShowIOSInstructions(false)}
          className="mt-4 w-full rounded-xl bg-brand-purple-900 py-2.5 text-sm font-bold text-white transition hover:bg-brand-purple-800"
        >
          Entendido
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] flex items-center gap-3 rounded-full bg-brand-pink-500 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-brand-pink-500/50 transition hover:scale-110 hover:bg-brand-pink-600 border-4 border-white"
    >
      <Download className="h-6 w-6" />
      MODO DEBUG: Instalar App
    </button>
  );
}