import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteField, // <-- Agregado para poder borrar campos
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Product } from "@/lib/types";
import { slugify } from "@/lib/utils/format";

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const q = query(collection(db, "products"), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty || (snapshot.docs.length === 1 && snapshot.docs[0].id === excludeId)) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createProduct(
  productData: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const slug = await generateUniqueSlug(productData.name);
    
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      slug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error: unknown) {
    console.error("[admin/products] Error al crear producto:", error);
    throw new Error("No se pudo crear el producto. Intenta de nuevo.");
  }
}

export async function updateProduct(
  productId: string,
  productData: Omit<Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>, "promotionalPrice"> & { promotionalPrice?: number | null }
): Promise<void> {
  try {
    const updateData: Record<string, unknown> = {
      ...productData,
      updatedAt: serverTimestamp(),
    };

    // Si promotionalPrice es null, lo eliminamos de Firestore
    if (productData.promotionalPrice === null) {
      updateData.promotionalPrice = deleteField();
    }

    // ✅ NUEVO: Si customizationOptions es undefined, lo eliminamos de Firestore
    if (productData.customizationOptions === undefined) {
      updateData.customizationOptions = deleteField();
    }

    if (productData.name) {
      const newSlug = await generateUniqueSlug(productData.name, productId);
      updateData.slug = newSlug;
    }

    await updateDoc(doc(db, "products", productId), updateData);
  } catch (error: unknown) {
    console.error("[admin/products] Error al actualizar producto:", error);
    throw new Error("No se pudo actualizar el producto. Intenta de nuevo.");
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (error: unknown) {
    console.error("[admin/products] Error al eliminar producto:", error);
    throw new Error("No se pudo eliminar el producto. Intenta de nuevo.");
  }
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
      } as Product;
    });
  } catch (error: unknown) {
    console.error("[admin/products] Error al obtener productos:", error);
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as Product;
  } catch (error: unknown) {
    console.error("[admin/products] Error al obtener producto:", error);
    return null;
  }
}