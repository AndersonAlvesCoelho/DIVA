import { DialogRegister } from "@/components/os/RegisterModal";
import { TopNav } from "@/components/top-nav";
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
      { title: "Ordem de Serviço — AeroHoras" },
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
