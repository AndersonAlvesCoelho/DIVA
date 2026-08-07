import { excelConfig } from "@/auth/authConfig";
import { excelService } from "@/services/excelService";
import { OSTipo, RegistroVoo } from "@/types/os";
import { castRows, rowsToObjects } from "@/utils/excel";
import { useIsAuthenticated } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";

interface UseRegistrosReturn {
  data: RegistroVoo[];
  isLoading: boolean;
  isError: boolean;
}

const itemId = excelConfig.driveItemId;

export function useRegistros(ordemDeServico: string, tipo: OSTipo): UseRegistrosReturn {
  const isAuthenticated = useIsAuthenticated();

  const tabela =
    tipo === "Rotativa" ? excelConfig.tables.controleRotativa : excelConfig.tables.controleFixa;

  const query = useQuery({
    queryKey: ["registros", tipo, ordemDeServico],
    enabled: isAuthenticated && !!itemId && !!ordemDeServico,
    queryFn: async (): Promise<RegistroVoo[]> => {
      const [cols, rows] = await Promise.all([
        excelService.getTableColumns(itemId, tabela),
        excelService.getTableRows(itemId, tabela),
      ]);
      const all = castRows<RegistroVoo>(rowsToObjects(cols, rows));
      return all.filter((r) => r.Acionamento === ordemDeServico);
    },
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
