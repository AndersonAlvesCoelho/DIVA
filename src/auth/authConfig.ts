import { Configuration } from "@azure/msal-browser";

console.log("CLIENT_ID:", import.meta.env.VITE_MSAL_CLIENT_ID);
console.log("TENANT_ID:", import.meta.env.VITE_MSAL_TENANT_ID);

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID}`,
    redirectUri:
      typeof window !== "undefined" ? `${window.location.origin}` : "http://localhost:8080",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest = {
  scopes: [
    "openid",
    "profile",
    "email",
    "offline_access",
    "User.Read",
    "Files.ReadWrite",
    "Sites.ReadWrite.All",
  ],
};

export const excelConfig = {
  driveItemId: import.meta.env.VITE_EXCEL_DRIVE_ITEM_ID as string,
  tables: {
    voosAR: "tbvoosAR",
    voosAF: "tbvoosAF",
    contratos: "tbContratos",
    controleRotativa: "tbControleVoosRotativa",
    controleFixa: "tbControleVoosFixa",
  },
};
