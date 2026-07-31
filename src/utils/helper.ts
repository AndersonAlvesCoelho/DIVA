import { useOSList } from "@/hooks/useOS";
import { UseOSByIdReturn } from "@/types/os";

export function useOSById(id: string): UseOSByIdReturn {
  const { data, isLoading, isError } = useOSList();
  const os = data.find((item) => item["Ordem de Servico"] === id);
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

export function parseHoras(value: string | number): number {
  const str = String(value ?? "")
    .replace("h", "")
    .trim();
  if (str.includes(":")) {
    const [h, m] = str.split(":").map(Number);
    return h + (m || 0) / 60;
  }
  return parseFloat(str) || 0;
}
