import type { DriveItem, ExcelRow, GraphListResponse, SharePointSite } from "@/types/excel";
import { graphApi } from "./graphApi";

const baseUrl = (itemId: string) => `/me/drive/items/${itemId}/workbook/tables`;
const spBaseUrl = (siteId: string, itemId: string) =>
  `/sites/${siteId}/drive/items/${itemId}/workbook/tables`;

export const excelService = {
  // ── OneDrive

  getDriveFiles: async (): Promise<DriveItem[]> => {
    const { data } = await graphApi.get<GraphListResponse<DriveItem>>("/me/drive/root/children");
    return data.value;
  },

  searchDriveFile: async (name: string): Promise<DriveItem[]> => {
    const { data } = await graphApi.get<GraphListResponse<DriveItem>>(
      `/me/drive/root/search(q='${name}')`,
    );
    return data.value;
  },

  // ── Excel — Leitura

  getTableRows: async (itemId: string, tableName: string): Promise<ExcelRow[]> => {
    const { data } = await graphApi.get<GraphListResponse<ExcelRow>>(
      `${baseUrl(itemId)}/${tableName}/rows`,
    );
    return data.value;
  },

  getTableColumns: async (itemId: string, tableName: string): Promise<{ name: string }[]> => {
    const { data } = await graphApi.get<GraphListResponse<{ name: string }>>(
      `${baseUrl(itemId)}/${tableName}/columns`,
    );
    return data.value;
  },

  // ── Excel — Escrita

  addTableRow: async (itemId: string, tableName: string, values: unknown[]): Promise<ExcelRow> => {
    const { data } = await graphApi.post<ExcelRow>(`${baseUrl(itemId)}/${tableName}/rows/add`, {
      values: [values],
    });
    return data;
  },

  // ── SharePoint

  getSites: async (): Promise<SharePointSite[]> => {
    const { data } = await graphApi.get<GraphListResponse<SharePointSite>>("/sites?search=*");
    return data.value;
  },

  getSharePointTableRows: async (
    siteId: string,
    itemId: string,
    tableName: string,
  ): Promise<ExcelRow[]> => {
    const { data } = await graphApi.get<GraphListResponse<ExcelRow>>(
      `${spBaseUrl(siteId, itemId)}/${tableName}/rows`,
    );
    return data.value;
  },

  addSharePointTableRow: async (
    siteId: string,
    itemId: string,
    tableName: string,
    values: unknown[],
  ): Promise<ExcelRow> => {
    const { data } = await graphApi.post<ExcelRow>(
      `${spBaseUrl(siteId, itemId)}/${tableName}/rows/add`,
      { values: [values] },
    );
    return data;
  },
};
