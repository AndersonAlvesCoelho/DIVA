import { getMe, getUserPhoto } from "@/services/graphService";
import { GraphUser } from "@/types/user";
import { useIsAuthenticated } from "@azure/msal-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface UserContextType {
  user: GraphUser | null;
  photoUrl: string | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  photoUrl: null,
  isLoading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const [user, setUser] = useState<GraphUser | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      setPhotoUrl(null);
      setIsLoading(false);
      return;
    }

    Promise.all([getMe(), getUserPhoto()])
      .then(([userData, photo]) => {
        setUser(userData);
        setPhotoUrl(photo);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ user, photoUrl, isLoading }}>{children}</UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
