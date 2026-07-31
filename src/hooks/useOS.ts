import { excelConfig } from "@/auth/authConfig";
import { excelService } from "@/services/excelService";
import type { OSReal } from "@/types/os";
import { ApplyPriority, castRows, OSComPriority, rowsToObjects } from "@/utils/excel";
import { useIsAuthenticated } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";

const itemId = excelConfig.driveItemId;

const safeStr = (val: unknown) => String(val ?? "").toLowerCase();

interface UseOSListReturn {
  data: OSComPriority[];
  datFilter: OSComPriority[];
  search: string;
  setSearch: (value: string) => void;
  isLoading: boolean;
  isError: boolean;
}

export function useOSList(): UseOSListReturn {
  const isAuthenticated = useIsAuthenticated();
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 300);

  const rotativaQuery = useQuery({
    queryKey: ["os", "rotativa"],
    enabled: isAuthenticated && !!itemId,
    queryFn: async (): Promise<OSReal[]> => {
      const [cols, rows] = await Promise.all([
        excelService.getTableColumns(itemId, excelConfig.tables.voosAR),
        excelService.getTableRows(itemId, excelConfig.tables.voosAR),
      ]);
      return castRows<OSReal>(rowsToObjects(cols, rows)).map((r) => ({
        ...r,
        tipo: "Rotativa" as const,
      }));
    },
  });

  const fixaQuery = useQuery({
    queryKey: ["os", "fixa"],
    enabled: isAuthenticated && !!itemId,
    queryFn: async (): Promise<OSReal[]> => {
      const [cols, rows] = await Promise.all([
        excelService.getTableColumns(itemId, excelConfig.tables.voosAF),
        excelService.getTableRows(itemId, excelConfig.tables.voosAF),
      ]);
      return castRows<OSReal>(rowsToObjects(cols, rows)).map((r) => ({
        ...r,
        tipo: "Fixa" as const,
      }));
    },
  });

  const data = useMemo(
    () =>
      ApplyPriority(
        [...(rotativaQuery.data ?? []), ...(fixaQuery.data ?? [])].filter(
          (os) => os["Status do Contrato"] === "Vigente",
        ),
      ),
    [rotativaQuery.data, fixaQuery.data],
  );

  const datFilter = useMemo(() => {
    if (!searchDebounced) return data;
    const q = searchDebounced.toLowerCase();
    return data.filter(
      (os) =>
        safeStr(os["Ordem de Servico"]).includes(q) ||
        safeStr(os.Contrato).includes(q) ||
        safeStr(os.Empresa).includes(q),
    );
  }, [data, searchDebounced]);

  return {
    data,
    datFilter,
    search,
    setSearch,
    isLoading: rotativaQuery.isLoading || fixaQuery.isLoading,
    isError: rotativaQuery.isError || fixaQuery.isError,
  };
}
