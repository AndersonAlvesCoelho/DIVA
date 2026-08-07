import axios from "axios";
import { ctrlExcelConfig, osExcelConfig } from "../config/azure";
import { getAppToken } from "./authService";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

// Cliente axios com token automático

async function graphClient() {
  const token = await getAppToken();
  return axios.create({
    baseURL: GRAPH_BASE,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

// Tipos

interface ExcelColumn {
  name: string;
}

export interface ExcelRow {
  index: number;
  values: unknown[][];
}

// Utilitário — converte linhas em objetos

function rowsToObjects(
  columns: ExcelColumn[],
  rows: ExcelRow[],
): Record<string, unknown>[] {
  return rows.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      obj[col.name] = row.values[0][i];
    });
    return obj;
  });
}

// Leitura genérica via /drives/{driveId}/items/{itemId}
// Funciona com Application permissions — sem /me/drive

async function getTableData(
  driveId: string,
  itemId: string,
  tableName: string,
): Promise<Record<string, unknown>[]> {
  const client = await graphClient();
  const base = `/drives/${driveId}/items/${itemId}/workbook/tables/${tableName}`;

  console.log("Chamando:", GRAPH_BASE + base);

  const [colsRes, rowsRes] = await Promise.all([
    client.get<{ value: ExcelColumn[] }>(`${base}/columns`),
    client.get<{ value: ExcelRow[] }>(`${base}/rows`),
  ]);

  return rowsToObjects(colsRes.data.value, rowsRes.data.value);
}

// Escrita genérica

async function addRow(
  driveId: string,
  itemId: string,
  tableName: string,
  values: unknown[],
): Promise<void> {
  const client = await graphClient();
  await client.post(
    `/drives/${driveId}/items/${itemId}/workbook/tables/${tableName}/rows/add`,
    { values: [values] },
  );
}

// OS — leitura do Excel 1 (SharePoint CONTROLE DE AERONAVE DIVA)

export async function getOSRotativa(): Promise<Record<string, unknown>[]> {
  const rows = await getTableData(
    osExcelConfig.driveId,
    osExcelConfig.itemId,
    osExcelConfig.tables.acionamentoAR,
  );
  return rows
    .filter((r) => r["Status do Contrato"] === "Vigente")
    .map((r) => ({ ...r, tipo: "Rotativa" }));
}

export async function getOSFixa(): Promise<Record<string, unknown>[]> {
  const rows = await getTableData(
    osExcelConfig.driveId,
    osExcelConfig.itemId,
    osExcelConfig.tables.acionamentoAF,
  );
  return rows
    .filter((r) => r["Status do Contrato"] === "Vigente")
    .map((r) => ({ ...r, tipo: "Fixa" }));
}

// Registros de voo — leitura e escrita do Excel 2 (SharePoint controle)

export async function getFlightRecords(
  tipo: "Rotativa" | "Fixa",
  acionamento: string,
): Promise<Record<string, unknown>[]> {
  const tableName =
    tipo === "Rotativa"
      ? ctrlExcelConfig.tables.voosAR
      : ctrlExcelConfig.tables.voosAF;

  const rows = await getTableData(
    ctrlExcelConfig.driveId,
    ctrlExcelConfig.itemId,
    tableName,
  );

  return rows.filter((r) => r["Acionamento"] === acionamento);
}

export async function addFlightRecord(
  tipo: "Rotativa" | "Fixa",
  values: unknown[],
): Promise<void> {
  const tableName =
    tipo === "Rotativa"
      ? ctrlExcelConfig.tables.voosAR
      : ctrlExcelConfig.tables.voosAF;

  await addRow(
    ctrlExcelConfig.driveId,
    ctrlExcelConfig.itemId,
    tableName,
    values,
  );
}

// UCs — leitura do Excel 2

export async function getUCs(): Promise<Record<string, unknown>[]> {
  return getTableData(
    ctrlExcelConfig.driveId,
    ctrlExcelConfig.itemId,
    ctrlExcelConfig.tables.ucs,
  );
}
