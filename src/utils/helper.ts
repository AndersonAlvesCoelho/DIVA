import { useOSList } from "@/hooks/useOS";
import { OSReal } from "@/types/os";

export function useOSById(id: string) {
  const { data, isLoading, isError } = useOSList();
  const os = data.find((item) => (item as Record<string, unknown>)["Ordem de Servico"] === id);
  return { os: os as OSReal | undefined, isLoading, isError };
}
