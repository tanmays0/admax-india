import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export { AuthContext };

const USER_KEY = "user";
const TOKEN_KEY = "token";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [bootstrapping, setBootstrapping] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_KEY))
  );

  const login = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setBootstrapping(false);
        return;
      }

      try {
        const res = await API.get("/auth/me");
        if (!cancelled) {
          login(storedToken, res.data.user);
        }
      } catch {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, [login, logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      bootstrapping,
      isAuthenticated: Boolean(token),
      role: user?.role || "advertiser",
      login,
      logout,
      updateUser,
    }),
    [user, token, bootstrapping, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
