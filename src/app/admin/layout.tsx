import type { Metadata } from "next";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Panel de Administración | FORJA",
  description: "Gestión de productos, pedidos y usuarios de FORJA.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-brand-neutral-50">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </AdminGuard>
  );
}