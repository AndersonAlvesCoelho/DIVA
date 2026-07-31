import { msalInstance } from "../auth/AuthProvider";
import { loginRequest } from "../auth/authConfig";

async function getToken(): Promise<string> {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) throw new Error("Usuário não autenticado");

  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: accounts[0],
  });

  return response.accessToken;
}

async function callGraph<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();

  const response = await fetch(`https://graph.microsoft.com/v1.0${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json() as Promise<T>;
}

// ── Usuário

export interface GraphUser {
  displayName: string;
  mail: string;
  userPrincipalName: string;
  id: string;
}

export const getMe = (): Promise<GraphUser> => callGraph<GraphUser>("/me");

export async function getUserPhoto(): Promise<string | null> {
  try {
    const token = await getToken();
    const response = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

// ── OneDrive

export interface DriveItem {
  id: string;
  name: string;
  size: number;
  lastModifiedDateTime: string;
}

export const getDriveFiles = (): Promise<{ value: DriveItem[] }> =>
  callGraph<{ value: DriveItem[] }>("/me/drive/root/children");

export const searchDriveFile = (name: string): Promise<{ value: DriveItem[] }> =>
  callGraph<{ value: DriveItem[] }>(`/me/drive/root/search(q='${name}')`);

// ── Excel — Leitura

export interface ExcelRow {
  index: number;
  values: unknown[][];
}

export const getTableRows = (itemId: string, tableName: string): Promise<{ value: ExcelRow[] }> =>
  callGraph<{ value: ExcelRow[] }>(`/me/drive/items/${itemId}/workbook/tables/${tableName}/rows`);

export const getTableColumns = (
  itemId: string,
  tableName: string,
): Promise<{ value: { name: string }[] }> =>
  callGraph<{ value: { name: string }[] }>(
    `/me/drive/items/${itemId}/workbook/tables/${tableName}/columns`,
  );

// ── Excel — Escrita

export const addTableRow = (
  itemId: string,
  tableName: string,
  values: unknown[],
): Promise<ExcelRow> =>
  callGraph<ExcelRow>(`/me/drive/items/${itemId}/workbook/tables/${tableName}/rows/add`, {
    method: "POST",
    body: JSON.stringify({ values: [values] }),
  });

// ── SharePoint

export interface SharePointSite {
  id: string;
  name: string;
  displayName: string;
  webUrl: string;
}

export const getSites = (): Promise<{ value: SharePointSite[] }> =>
  callGraph<{ value: SharePointSite[] }>("/sites?search=*");

export const getSharePointTableRows = (
  siteId: string,
  itemId: string,
  tableName: string,
): Promise<{ value: ExcelRow[] }> =>
  callGraph<{ value: ExcelRow[] }>(
    `/sites/${siteId}/drive/items/${itemId}/workbook/tables/${tableName}/rows`,
  );

export const addSharePointTableRow = (
  siteId: string,
  itemId: string,
  tableName: string,
  values: unknown[],
): Promise<ExcelRow> =>
  callGraph<ExcelRow>(
    `/sites/${siteId}/drive/items/${itemId}/workbook/tables/${tableName}/rows/add`,
    {
      method: "POST",
      body: JSON.stringify({ values: [values] }),
    },
  );
