import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export type SignUpCredentials = {
  email: string;
  password: string;
  fullName?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthError = {
  message: string;
};

export const signUp = async (
  credentials: SignUpCredentials,
): Promise<{ user: User | null; error: AuthError | null }> => {
  const { email, password, fullName } = credentials;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "",
      },
    },
  });

  if (error) {
    return { user: null, error: { message: error.message } };
  }

  return { user: data.user, error: null };
};

export const login = async (
  credentials: LoginCredentials,
): Promise<{ user: User | null; error: AuthError | null }> => {
  const { email, password } = credentials;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: { message: error.message } };
  }

  return { user: data.user, error: null };
};

export const logout = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
};

export const getCurrentUser = async (): Promise<{
  user: User | null;
  error: AuthError | null;
}> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error: { message: error.message } };
  }

  return { user: data.user, error: null };
};

export const resetPassword = async (
  email: string,
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
};

export const updateUserProfile = async (updates: {
  fullName?: string;
  avatar_url?: string;
}): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: updates.fullName,
      avatar_url: updates.avatar_url,
    },
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
};
