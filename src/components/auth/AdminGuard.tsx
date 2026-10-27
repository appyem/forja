"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToAuthStateChanged, getUserProfile } from "@/services/auth";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToAuthStateChanged(async (firebaseUser) => {
      if (!isMounted) return;

      if (!firebaseUser) {
        setStatus("unauthorized");
        router.replace("/login?redirect=/admin");
        return;
      }

      try {
        const profile = await getUserProfile(firebaseUser.uid);
        if (!isMounted) return;

        console.log("🚨 DEBUG ABSOLUTO - Perfil:", profile, "| Rol extraído:", JSON.stringify(profile?.role));

        const role = String(profile?.role || "").trim().toLowerCase();
        
        if (role === "admin") {
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
          router.replace("/cuenta");
        }
      } catch {
        // Bloque catch vacío intencional: evita el error de variable no usada de ESLint
        if (!isMounted) return;
        setStatus("unauthorized");
        router.replace("/cuenta");
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-pink-500" />
          <p className="text-sm text-brand-neutral-500">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return null;
  }

  return <>{children}</>;
}