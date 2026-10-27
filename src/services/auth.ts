import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import type { User as UserType } from "@/lib/types";

/**
 * Registra un nuevo usuario en Firebase Auth y crea su documento en Firestore.
 */
export async function registerUser(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData: UserType = {
      id: user.uid,
      email: user.email!,
      displayName,
      role: "client",
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), userData);
    return { success: true, user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido al registrar";
    return { success: false, error: message };
  }
}

/**
 * Inicia sesión con email y contraseña.
 */
export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido al iniciar sesión";
    return { success: false, error: message };
  }
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido al cerrar sesión";
    return { success: false, error: message };
  }
}

/**
 * Hook/Listener para observar el estado de autenticación.
 */
export function subscribeToAuthStateChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Obtiene los datos del usuario desde Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserType | null> {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UserType;
    }
    return null;
  } catch (error: unknown) {
    console.error("[auth] Error al obtener perfil:", error instanceof Error ? error.message : error);
    return null;
  }
}