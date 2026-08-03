import { useOSList } from "@/hooks/useOS";
import { UseOSByIdReturn } from "@/types/os";

export function useOSById(id: string): UseOSByIdReturn {
  const { data, isLoading, isError } = useOSList();
  const os = data.find((item) => item["Ordem de Serviço"] === id);
  return { os, isLoading, isError };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function parseHoras(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;

  // Número decimal do Excel (ex: 4.166... = 4h10m)
  if (typeof value === "number") return value;

  const str = String(value).replace("h", "").trim();

  // Formato HH:MM:SS ou HH:MM
  if (str.includes(":")) {
    const parts = str.split(":").map(Number);
    const [h = 0, m = 0] = parts;
    return h + m / 60;
  }

  return parseFloat(str) || 0;
}
