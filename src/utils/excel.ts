import type { ExcelRow } from "@/types/excel";
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
    endDateParsed: parseDateBR(os["Final da Operacao"]),
  }));

  // Top 3 com data fim mais próxima do futuro
  const futureIds = withDates
    .filter((os) => os.endDateParsed !== null && os.endDateParsed >= today)
    .sort((a, b) => a.endDateParsed!.getTime() - b.endDateParsed!.getTime())
    .slice(0, 3)
    .map((os) => os["Ordem de Servico"]);

  return withDates
    .map((os): OSComPriority => {
      const isPast = os.endDateParsed === null || os.endDateParsed < today;
      const priority: OSPriority = isPast ? 3 : futureIds.includes(os["Ordem de Servico"]) ? 1 : 2;

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
