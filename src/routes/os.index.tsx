import OSCard from "@/components/os/OSCard";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useOSList } from "@/hooks/useOS";
import type { OSReal } from "@/types/os";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plane, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/os/")({
  head: () => ({
    meta: [
      { title: "Ordens de Serviço — AeroHoras" },
      { name: "description", content: "Selecione a Ordem de Serviço da operação aérea atual." },
    ],
  }),
  component: OSListPage,
});

function OSListPage() {
  const navigate = useNavigate();
  const { datFilter, search, setSearch, isLoading, isError } = useOSList();
  const [osSelect, setOsSeelct] = useState<OSReal | null>(null);

  const handleSelecionar = (os: OSReal) => {
    setOsSeelct((prev) => (prev?.["Ordem de Servico"] === os["Ordem de Servico"] ? null : os));
  };

  const handleContinuar = () => {
    if (!osSelect) return;
    navigate({
      to: "/os/$id",
      params: { id: encodeURIComponent(osSelect["Ordem de Servico"]) },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-10">
        {/* Header */}
        <div className="mb-2">
          <p className="text-xs text-muted-foreground">Início / Selecionar contrato</p>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Selecione o contrato</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha o contrato ativo para registrar suas horas de voo. Você poderá trocar de contrato
          a qualquer momento.
        </p>

        {/* Search */}
        <div className="relative my-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, contrato ou empresa..."
            className="h-11 pl-10"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            Erro ao carregar as Ordens de Serviço. Verifique sua conexão e tente novamente.
          </div>
        )}

        {/* Grid de cards */}
        {!isLoading && !isError && (
          <>
            {datFilter.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                {search
                  ? `Nenhuma OS encontrada para "${search}"`
                  : "Nenhuma OS vigente encontrada."}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {datFilter.map((os) => (
                  <OSCard
                    key={os["Ordem de Servico"]}
                    os={os}
                    selecionada={osSelect?.["Ordem de Servico"] === os["Ordem de Servico"]}
                    onSelecionar={() => handleSelecionar(os)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer fixo */}
      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <span className="text-sm text-muted-foreground">
            {osSelect
              ? `${osSelect["Ordem de Servico"]} selecionada`
              : "Nenhum contrato selecionado"}
          </span>
          <Button onClick={handleContinuar} disabled={!osSelect} className="gap-2">
            Continuar para registro de horas
            <Plane className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
