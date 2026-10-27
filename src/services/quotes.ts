import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface QuoteData {
  fullName: string;
  email: string;
  phone: string;
  productType: string;
  quantity: number;
  details: string;
}

export async function createQuote(data: QuoteData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "quotes"), {
      ...data,
      status: "pending", // pending, contacted, closed
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: unknown) {
    console.error("[quotes] Error al crear cotización:", error);
    throw new Error("No se pudo enviar la solicitud. Intenta de nuevo.");
  }
}