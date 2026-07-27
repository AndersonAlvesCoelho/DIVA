import { EventType, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { type ReactNode, useEffect, useState } from "react";
import { msalConfig } from "./authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    msalInstance.initialize().then(() => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }

      msalInstance.addEventCallback((event) => {
        if (
          event.eventType === EventType.LOGIN_SUCCESS &&
          event.payload &&
          "account" in event.payload &&
          event.payload.account
        ) {
          msalInstance.setActiveAccount(event.payload.account);
        }
      });

      setInitialized(true);
    });
  }, []);

  if (!initialized) return null;

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
