import { parseExcelSerial } from "./excel";

export function formatDateBR(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function parseDateBR(value: unknown): Date | null {
  if (!value) return null;

  // Número serial do Excel
  if (typeof value === "number") {
    return parseExcelSerial(value);
  }

  const str = String(value).trim();
  if (!str) return null;

  // Formato dd/mm/yyyy
  const parts = str.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month - 1, day);
    }
  }

  return null;
}
