import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useCallback } from "react";
import { loginRequest } from "../auth/authConfig";

export function useAuth() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const user = accounts[0]
    ? {
        name: accounts[0].name ?? "",
        email: accounts[0].username ?? "",
        id: accounts[0].localAccountId,
      }
    : null;

  const login = useCallback(async () => {
    await instance.loginRedirect(loginRequest);
  }, [instance]);

  const logout = useCallback(async () => {
    await instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  }, [instance]);

  return { isAuthenticated, user, login, logout };
}
