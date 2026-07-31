export function calcTempo(inicio: string, fim: string): { hhmm: string; dec: string } {
  if (!inicio || !fim) return { hhmm: "--:--", dec: "0,00" };
  const [hi, mi] = inicio.split(":").map(Number);
  const [hf, mf] = fim.split(":").map(Number);
  if ([hi, mi, hf, mf].some((n) => Number.isNaN(n))) return { hhmm: "--:--", dec: "0,00" };
  let diff = hf * 60 + mf - (hi * 60 + mi);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return {
    hhmm: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    dec: (diff / 60).toFixed(2).replace(".", ","),
  };
}

export function formatDateBR(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function parseExcelSerial(serial: number): Date {
  // Excel serial: dias desde 01/01/1900, com bug do ano 1900
  const MS_PER_DAY = 86400000;
  const EXCEL_EPOCH = new Date(1899, 11, 30).getTime();
  return new Date(EXCEL_EPOCH + serial * MS_PER_DAY);
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
