import { getMe, type GraphUser } from "@/services/graphService";
import { useIsAuthenticated } from "@azure/msal-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface UserContextType {
  user: GraphUser | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, isLoading: true });

export function UserProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const [user, setUser] = useState<GraphUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  return <UserContext.Provider value={{ user, isLoading }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
