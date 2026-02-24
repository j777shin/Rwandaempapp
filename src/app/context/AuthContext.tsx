import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "@/app/lib/api";

interface BeneficiaryData {
  id: string;
  name: string;
  track: string | null;
  selection_status: string;
  skillcraft_score: number | null;
  pathways_completion_rate: number | null;
  wants_entrepreneurship: boolean;
}

interface UserData {
  id: string;
  email: string;
  role: "beneficiary" | "admin";
  beneficiary?: BeneficiaryData;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserData>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // Always refresh user data on mount to ensure beneficiary data is current
  useEffect(() => {
    if (token) {
      refreshUser().catch(() => logout());
    }
  }, []);

  const login = async (email: string, password: string): Promise<UserData> => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Save token before clearing, so we can still call the backend
    const savedToken = localStorage.getItem("token");

    // Clear local state immediately
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Call backend to reset test account data using the saved token directly
    if (savedToken) {
      try {
        await fetch("http://localhost:8001/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedToken}`,
          },
        });
      } catch {
        // Ignore errors (e.g. expired token, network issues)
      }
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
