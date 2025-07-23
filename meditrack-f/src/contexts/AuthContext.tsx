import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "medecin" | "infirmier";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/user");
      setUser(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    await api.get("/sanctum/csrf-cookie");

    const response = await api.post("/api/login", {
      email,
      password,
    });

    const { accessToken, user: userData } = response.data;

    localStorage.setItem("token", accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(userData);

    return userData;
  };

  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
