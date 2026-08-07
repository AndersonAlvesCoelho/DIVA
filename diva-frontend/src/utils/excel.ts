import type { ExcelRow } from "@/types/excel";
import type { CommonFields, FlightRecord, FlightRowInput } from "@/types/flightRecord";
import type { OSReal } from "@/types/os";
import { formatDateBR, parseDateBR } from "./utils";

export function rowsToObjects(
  columns: { name: string }[],
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

export function navigateToOS(ordemDeServico: string): string {
  return encodeURIComponent(ordemDeServico);
}

export function castRows<T>(rows: Record<string, unknown>[]): T[] {
  return rows as unknown as T[];
}

export type OSPriority = 1 | 2 | 3;

export interface OSComPriority extends OSReal {
  prioridade: OSPriority;
  endDateParsed: Date | null;
  endDateFormatted: string;
}

export function ApplyPriority(list: OSReal[]): OSComPriority[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const withDates = list.map((os) => ({
    ...os,
    endDateParsed: parseDateBR(os["Final da Operação"]),
  }));

  // Top 3 com data fim mais próxima do futuro
  const futureIds = withDates
    .filter((os) => os.endDateParsed !== null && os.endDateParsed >= today)
    .sort((a, b) => a.endDateParsed!.getTime() - b.endDateParsed!.getTime())
    .slice(0, 3)
    .map((os) => os["Ordem de Serviço"]);

  return withDates
    .map((os): OSComPriority => {
      const isPast = os.endDateParsed === null || os.endDateParsed < today;
      const priority: OSPriority = isPast ? 3 : futureIds.includes(os["Ordem de Serviço"]) ? 1 : 2;

      return {
        ...os,
        endDateParsed: os.endDateParsed,
        endDateFormatted: formatDateBR(os.endDateParsed),
        prioridade: priority,
      };
    })
    .sort((a, b) => {
      if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade;
      const aTime = a.endDateParsed?.getTime() ?? 0;
      const bTime = b.endDateParsed?.getTime() ?? 0;
      return bTime - aTime;
    });
}

// --------------

export function calcFlightTime(
  startTime: string,
  endTime: string,
): { hhmm: string; decimal: string } {
  if (!startTime || !endTime) return { hhmm: "--:--", decimal: "0,00" };
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  if ([sh, sm, eh, em].some(isNaN)) return { hhmm: "--:--", decimal: "0,00" };
  let diff = eh * 60 + em - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return {
    hhmm: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    decimal: (diff / 60).toFixed(2).replace(".", ","),
  };
}

export function buildFlightRecords(
  os: OSReal,
  rows: FlightRowInput[],
  common: CommonFields,
): FlightRecord[] {
  return rows
    .filter((r) => r.standby || (r.startTime && r.endTime))
    .map((r) => {
      const { hhmm, decimal } = r.standby
        ? { hhmm: "01:00", decimal: "1,00" }
        : calcFlightTime(r.startTime, r.endTime);

      return {
        Contrato: os.Contrato,
        Empresa: os.Empresa,
        "Unidade Solicitante": os["Unidade Solicitante"],
        Acionamento: os["Ordem de Serviço"],
        Base: os.Base,
        "Status do Contrato": os["Status do Contrato"],
        "Data do Voo": common.date,
        Partida: r.standby ? "" : r.startTime,
        Corte: r.standby ? "" : r.endTime,
        "Tempo de Voo": hhmm,
        Decimais: decimal,
        Plantão: r.standby ? "1" : "0",
        Objetivo: os.Objetivo,
        Bioma: os.Bioma,
        Unidade: Array.isArray(r.ucs) ? r.ucs.join("; ") : typeof r.ucs === "string" ? r.ucs : "",
        "Modelo - Aeronave": os["Modelo da Aeronave"],
        "Prefixo Aeronave": common.prefix,
        Piloto: common.pilot,
      };
    });
}

export function parseExcelSerial(serial: number): Date {
  // Excel serial: dias desde 01/01/1900, com bug do ano 1900
  const MS_PER_DAY = 86400000;
  const EXCEL_EPOCH = new Date(1899, 11, 30).getTime();
  return new Date(EXCEL_EPOCH + serial * MS_PER_DAY);
}

export function formatFlightDate(value: unknown): string {
  if (!value) return "—";
  if (typeof value === "number") {
    return parseExcelSerial(value).toLocaleDateString("pt-BR");
  }
  const str = String(value).trim();
  if (!str) return "—";
  try {
    if (str.includes("T")) return new Date(str).toLocaleDateString("pt-BR");
    return str;
  } catch {
    return str;
  }
}

export function formatFlightTime(value: unknown): string {
  if (!value && value !== 0) return "—";

  // Número serial do Excel — fração do dia
  if (typeof value === "number") {
    const totalMinutes = Math.round(value * 24 * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  const str = String(value).trim();
  if (!str) return "—";

  // ISO datetime — extrai só HH:MM
  if (str.includes("T")) return str.split("T")[1]?.slice(0, 5) ?? str;

  return str;
}

export function formatDecimal(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "number" ? value : parseFloat(String(value).replace(",", "."));
  if (isNaN(num)) return "—";
  return num.toFixed(2).replace(".", ",");
}
