import { useIsAuthenticated } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import { excelConfig } from "../auth/authConfig";
import { getTableColumns, getTableRows } from "../services/graphService";

function rowsToObjects(
  columns: { name: string }[],
  rows: { values: unknown[][] }[],
): Record<string, unknown>[] {
  return rows.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      obj[col.name] = row.values[0][i];
    });
    return obj;
  });
}

export function useOSList() {
  const isAuthenticated = useIsAuthenticated();
  const itemId = excelConfig.driveItemId;

  const rotativaQuery = useQuery({
    queryKey: ["os", "rotativa"],
    enabled: isAuthenticated && !!itemId,
    queryFn: async () => {
      const [cols, rows] = await Promise.all([
        getTableColumns(itemId, excelConfig.tables.voosAR),
        getTableRows(itemId, excelConfig.tables.voosAR),
      ]);
      return rowsToObjects(cols.value, rows.value).map((r) => ({
        ...r,
        tipo: "Rotativa" as const,
      }));
    },
  });

  const fixaQuery = useQuery({
    queryKey: ["os", "fixa"],
    enabled: isAuthenticated && !!itemId,
    queryFn: async () => {
      const [cols, rows] = await Promise.all([
        getTableColumns(itemId, excelConfig.tables.voosAF),
        getTableRows(itemId, excelConfig.tables.voosAF),
      ]);
      return rowsToObjects(cols.value, rows.value).map((r) => ({
        ...r,
        tipo: "Fixa" as const,
      }));
    },
  });

  const allOS = [...(rotativaQuery.data ?? []), ...(fixaQuery.data ?? [])].filter(
    (os) => os["Status do Contrato"] === "Vigente",
  );

  return {
    data: allOS,
    isLoading: rotativaQuery.isLoading || fixaQuery.isLoading,
    isError: rotativaQuery.isError || fixaQuery.isError,
  };
}
