import { excelConfig } from "@/auth/authConfig";
import { excelService } from "@/services/excelService";
import type { UCOption, UCRecord } from "@/types/flightRecord";
import { castRows, rowsToObjects } from "@/utils/excel";
import { useIsAuthenticated } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";

const itemId = excelConfig.driveItemId;

export function useUCs() {
  const isAuthenticated = useIsAuthenticated();

  const query = useQuery({
    queryKey: ["ucs"],
    enabled: isAuthenticated && !!itemId,
    staleTime: 1000 * 60 * 60, // 1 hora — lista de UCs muda raramente
    queryFn: async (): Promise<UCOption[]> => {
      const [cols, rows] = await Promise.all([
        excelService.getTableColumns(itemId, excelConfig.tables.ucs),
        excelService.getTableRows(itemId, excelConfig.tables.ucs),
      ]);

      return castRows<UCRecord>(rowsToObjects(cols, rows)).map((uc) => ({
        value: uc["Nome Padrão"],
        label: uc["Nome Padrão"],
      }));
    },
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
