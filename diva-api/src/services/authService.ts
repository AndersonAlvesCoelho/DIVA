import { ConfidentialClientApplication } from "@azure/msal-node";
import { azureConfig } from "../config/azure";

// Instância singleton do MSAL

const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: azureConfig.clientId,
    authority: azureConfig.authority,
    clientSecret: azureConfig.clientSecret,
  },
});

// Cache simples de token em memória

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Obtém token de Application (não delegado)

export async function getAppToken(): Promise<string> {
  const now = Date.now();

  // Retorna token do cache se ainda válido (com 60s de margem)
  if (cachedToken && now < tokenExpiry - 60_000) {
    return cachedToken;
  }

  const result = await msalClient.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  });

  if (!result?.accessToken) {
    throw new Error("Falha ao obter token de aplicação");
  }

  cachedToken = result.accessToken;
  tokenExpiry = result.expiresOn?.getTime() ?? now + 3600_000;

  return cachedToken;
}
