import { getSupabaseClient } from "@/lib/supabase";

const USERS_TABLE = "users";
const AUTH_STORAGE_KEY = "giomila:user";

interface UsersRow {
  id: string;
  email: string;
  name?: string | null;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
}

const parseStoredUser = (value: string | null): AuthenticatedUser | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthenticatedUser;
  } catch (parseError) {
    console.warn("Não foi possível interpretar o usuário salvo", parseError);
    return null;
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthenticatedUser | null> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select<UsersRow>("id,email,name")
    .match({ email, password })
    .maybeSingle();

  if (error) {
    console.error("Erro ao consultar tabela users:", error.message);
    throw new Error("Não foi possível validar suas credenciais agora. Tente novamente.");
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name ?? null,
  };
};

export const persistAuthenticatedUser = (
  user: AuthenticatedUser,
  remember: boolean
) => {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify(user);
  if (remember) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, payload);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, payload);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const getStoredUser = (): AuthenticatedUser | null => {
  if (typeof window === "undefined") return null;

  return (
    parseStoredUser(window.localStorage.getItem(AUTH_STORAGE_KEY)) ??
    parseStoredUser(window.sessionStorage.getItem(AUTH_STORAGE_KEY))
  );
};

export const clearStoredUser = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isAuthenticated = () => getStoredUser() !== null;
