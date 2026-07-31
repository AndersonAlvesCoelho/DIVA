import { DialogRegister } from "@/components/os/RegisterModal";
import { TopNav } from "@/components/TopNav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useOSById } from "@/hooks/useOS";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Home, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/os/$id")({
  head: () => ({
    meta: [
      { title: "Ordem de Serviço — Altas Horas" },
      { name: "description", content: "Resumo da OS e registros de horas de voo." },
    ],
  }),
  component: OSDetail,
});

// ── Página principal ────────────────────────────────────────────────────────

function OSDetail() {
  const { id } = useParams({ from: "/os/$id" });
  const { os, isLoading, isError } = useOSById(decodeURIComponent(id));
  const [openModal, setOpenModal] = useState(false);

  if (isLoading) return <LoadingState />;
  if (isError || !os) return <ErrorState />;

  const vigente = os["Status do Contrato"] === "Vigente";

  const campos: [string, string | number][] = [
    ["Contrato", os.Contrato],
    ["Empresa", os.Empresa],
    ["Status do Contrato", os["Status do Contrato"]],
    ["Unidade Solicitante", os["Unidade Solicitante"]],
    ["Formulário SEI", os.Formulario],
    ["Ordem de Serviço", os["Ordem de Servico"]],
    ["Base", os.Base],
    ["Horas Acionadas", os["Horas Acionadas"]],
    ["Objetivo", os.Objetivo],
    ["Prefixo Aeronaves", os["Prefixo Aeronaves"]],
    ["Modelo da Aeronave", os["Modelo da Aeronave"]],
    ["Unidade", os.Unidade],
    ["Bioma", os.Bioma],
    ["Início da Operação", os["Inicio da Operacao"]],
    ["Final da Operação", os["Final da Operacao"]],
    ["Qtd. Dias", os["Quantidade de Dias"]],
    ["Qtd. Aeronaves", os["Quantidade de Aeronaves"]],
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopNav />

      <DialogRegister
        os={os}
        open={openModal}
        onOpenChange={setOpenModal}
        onSave={(voos, campos) => {
          console.log("Salvar:", voos, campos);
        }}
      />

      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/os" className="inline-flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5" />
                  Ordens de Serviço
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{os["Ordem de Servico"]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header  */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  vigente ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${vigente ? "bg-success" : "bg-muted-foreground"}`}
                />
                {os["Status do Contrato"]}
              </span>
              <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                {os.tipo}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{os["Ordem de Servico"]}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {os.Contrato} · {os.Empresa}
            </p>
          </div>
        </div>

        {/* Resumo */}
        <section className="rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(6,29,43,0.04)]">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Resumo da OS</h2>
              <p className="text-xs text-muted-foreground">
                Dados do contrato e da operação em curso.
              </p>
            </div>
          </header>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {campos.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 truncate text-sm font-semibold text-foreground">
                  {String(value ?? "—")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-8 right-8 z-20 inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_rgba(0,84,128,0.55)] transition-all hover:opacity-95"
      >
        <Plus className="h-4 w-4" />
        Novo Registro
      </button>
    </div>
  );
}

// ── Estados de loading e erro ───────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </main>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-[1400px] px-6 py-10 space-y-4">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          OS não encontrada ou erro ao carregar. Verifique se a OS existe e tente novamente.
        </div>
        <Link
          to="/os"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          ← Voltar para Ordens de Serviço
        </Link>
      </main>
    </div>
  );
}
