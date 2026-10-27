
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Product } from "@/lib/types";
import { seedProducts } from "@/lib/data/seed-products";

/**
 * Obtiene todos los productos activos desde Firestore.
 * Si la base de datos está vacía (primera ejecución), devuelve los datos semilla.
 */
export async function getActiveProducts(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("isActive", "==", true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("[products] Firestore vacío, usando datos semilla para desarrollo");
      return seedProducts;
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
      } as Product;
    });
  } catch (error) {
    console.error("[products] Error al obtener productos:", error);
    return seedProducts;
  }
}

/**
 * Obtiene productos filtrados por categoría.
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("isActive", "==", true),
      where("categoryId", "==", categoryId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return seedProducts.filter((p) => p.categoryId === categoryId);
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
      } as Product;
    });
  } catch (error) {
    console.error("[products] Error al obtener productos por categoría:", error);
    return seedProducts.filter((p) => p.categoryId === categoryId);
  }
}

/**
 * Obtiene un producto por su slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const q = query(
      collection(db, "products"),
      where("slug", "==", slug),
      where("isActive", "==", true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return seedProducts.find((p) => p.slug === slug) ?? null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as Product;
  } catch (error) {
    console.error("[products] Error al obtener producto por slug:", error);
    return seedProducts.find((p) => p.slug === slug) ?? null;
  }
}