import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type QuoteStatus = "pending" | "contacted" | "closed";

export interface Quote {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  productType: string;
  quantity: number;
  details: string;
  status: QuoteStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllQuotes(): Promise<Quote[]> {
  try {
    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        fullName: data.fullName ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        productType: data.productType ?? "",
        quantity: data.quantity ?? 0,
        details: data.details ?? "",
        status: (data.status as QuoteStatus) ?? "pending",
        adminNotes: data.adminNotes,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
      } as Quote;
    });
  } catch (error: unknown) {
    console.error("[admin/quotes] Error al obtener cotizaciones:", error);
    return [];
  }
}

export async function getQuoteById(quoteId: string): Promise<Quote | null> {
  try {
    const docRef = doc(db, "quotes", quoteId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      fullName: data.fullName ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      productType: data.productType ?? "",
      quantity: data.quantity ?? 0,
      details: data.details ?? "",
      status: (data.status as QuoteStatus) ?? "pending",
      adminNotes: data.adminNotes,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as Quote;
  } catch (error: unknown) {
    console.error("[admin/quotes] Error al obtener cotización:", error);
    return null;
  }
}

export async function updateQuoteStatus(
  quoteId: string,
  status: QuoteStatus,
  adminNotes?: string
): Promise<void> {
  try {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: serverTimestamp(),
    };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    await updateDoc(doc(db, "quotes", quoteId), updateData);
  } catch (error: unknown) {
    console.error("[admin/quotes] Error al actualizar cotización:", error);
    throw new Error("No se pudo actualizar la cotización.");
  }
}