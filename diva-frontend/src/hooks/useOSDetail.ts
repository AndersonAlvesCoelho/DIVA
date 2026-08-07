import { excelConfig } from "@/auth/authConfig";
import { excelService } from "@/services/excelService";
import type { FlightRecord } from "@/types/flightRecord";
import type { OSReal } from "@/types/os";
import { castRows, rowsToObjects } from "@/utils/excel";
import { parseHoras } from "@/utils/helper";
import { formatDateBR, parseDateBR } from "@/utils/utils";
import { useIsAuthenticated } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import { useOSList } from "./useOS";

const itemId = excelConfig.driveItemId;

function getFlightTable(tipo: OSReal["tipo"]): string {
  return tipo === "Rotativa"
    ? excelConfig.tables.controleRotativa
    : excelConfig.tables.controleFixa;
}

// ── Tipos de retorno

export interface OSSummaryField {
  label: string;
  value: string;
}

interface UseOSDetailReturn {
  os: OSReal | undefined;
  records: FlightRecord[];
  summaryFields: OSSummaryField[];
  hasRecords: boolean;
  isLoading: boolean;
  isError: boolean;
  isLoadingRecords: boolean;
  isErrorRecords: boolean;
}

// ── Hook principal

export function useOSDetail(id: string): UseOSDetailReturn {
  const isAuthenticated = useIsAuthenticated();

  // OS — busca na lista em cache
  const { data: osList, isLoading: isLoadingOS, isError: isErrorOS } = useOSList();
  const os = osList.find((item) => item["Ordem de Serviço"] === id);

  // Registros de voo
  const flightTable = os ? getFlightTable(os.tipo) : "";

  const flightQuery = useQuery({
    queryKey: ["flightRecords", os?.tipo, id],
    enabled: isAuthenticated && !!itemId && !!os && !!flightTable,
    queryFn: async (): Promise<FlightRecord[]> => {
      const [cols, rows] = await Promise.all([
        excelService.getTableColumns(itemId, flightTable),
        excelService.getTableRows(itemId, flightTable),
      ]);
      const all = castRows<FlightRecord>(rowsToObjects(cols, rows));

      return all.filter((r) => r.Acionamento === id);
    },
  });

  const records = flightQuery.data ?? [];
  const hasRecords = !flightQuery.isLoading && !flightQuery.isError && records.length > 0;

  // Campos do resumo — formatados aqui, fora da view
  const summaryFields: OSSummaryField[] = os
    ? [
        { label: "Contrato", value: os.Contrato },
        { label: "Empresa", value: os.Empresa },
        { label: "Status do Contrato", value: os["Status do Contrato"] },
        { label: "Unidade Solicitante", value: os["Unidade Solicitante"] },
        { label: "Formulário", value: os["Formulário"] },
        { label: "Ordem de Serviço", value: os["Ordem de Serviço"] },
        { label: "Base", value: os.Base },
        {
          label: "Horas Acionadas",
          value: `${parseHoras(os["Horas Acionadas"]).toFixed(2)}h`,
        },
        { label: "Objetivo", value: os.Objetivo },
        { label: "Prefixo Aeronaves", value: os["Prefixo"] },
        { label: "Tipo de Aeronave", value: os["Tipo de Aeronave"] },
        { label: "Modelo da Aeronave", value: os["Modelo da Aeronave"] },
        { label: "Unidade de Conservação", value: os.Unidade },
        { label: "CNUC", value: os.CNUC },
        { label: "Bioma", value: os.Bioma },
        {
          label: "Início da Operação",
          value: formatDateBR(parseDateBR(os["Inicio da Operação"])),
        },
        {
          label: "Final da Operação",
          value: formatDateBR(parseDateBR(os["Final da Operação"])),
        },
        { label: "Qtd. Dias", value: String(os["Quant. Dias"] ?? "—") },
        { label: "Qtd. Aeronaves", value: String(os["Quant. Aeronaves"] ?? "—") },
        { label: "Fonte Orçamentária", value: os["Fonte Orçamentária "] },
        { label: "Nº do Empenho", value: os["Numero do Empenho"] },
        {
          label: "Valor Hora/Voo",
          value: os["Valor Hora/Voo"]
            ? `R$ ${Number(os["Valor Hora/Voo"]).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            : "—",
        },
        {
          label: "Valor Estimado",
          value: os["Valor Estimado"]
            ? `R$ ${Number(os["Valor Estimado"]).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            : "—",
        },
        { label: "Total de Horas Voadas", value: String(os["Total de Horas Voadas"] ?? "—") },
        { label: "Horas Remanescentes", value: String(os["Horas Remanescentes"] ?? "—") },
        { label: "Status do Acionamento", value: os.Status },
      ]
    : [];

  return {
    os,
    records,
    summaryFields,
    hasRecords,
    isLoading: isLoadingOS || flightQuery.isLoading,
    isError: isErrorOS || flightQuery.isError,

    isLoadingRecords: flightQuery.isLoading,
    isErrorRecords: flightQuery.isError,
  };
}
