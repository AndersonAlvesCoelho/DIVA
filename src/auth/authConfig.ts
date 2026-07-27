import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "",
    authority: "https://login.microsoftonline.com/",
    redirectUri:
      typeof window !== "undefined" ? `${window.location.origin}` : "http://localhost:8080",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
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

// IDs do arquivo Excel no OneDrive/SharePoint
// Preencher após localizar os arquivos via Graph API
export const excelConfig = {
  driveItemId: "", // ID do arquivo Excel Master
  tables: {
    voosAR: "tbvoosAR",
    voosAF: "tbvoosAF",
    contratos: "tbContratos",
    controleRotativa: "tbControleVoosRotativa",
    controleFixa: "tbControleVoosFixa",
  },
};
