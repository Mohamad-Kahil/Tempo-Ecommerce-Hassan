import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getCurrentUser, logout } from "@/services/authService";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const { user: currentUser, error } = await getCurrentUser();

      if (error) {
        console.error("Error fetching current user:", error);
        setUser(null);
        return;
      }

      setUser(currentUser);
    } catch (error) {
      console.error("Unexpected error in refreshUser:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await logout();
      if (error) {
        console.error("Error logging out:", error);
        return;
      }
      setUser(null);
    } catch (error) {
      console.error("Unexpected error in logout:", error);
    }
  };

  useEffect(() => {
    refreshUser();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if user has admin role
  const isAdmin = !!user && user.app_metadata?.role === "admin";

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    logout: handleLogout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
