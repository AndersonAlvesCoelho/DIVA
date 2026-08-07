import { DialogRegister } from "@/components/DialogRegister";
import { FlightRecordsTable } from "@/components/FlightRecordsTable";
import { TopNav } from "@/components/TopNav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOSDetail } from "@/hooks/useOSDetail";
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

// ── Página principal

function OSDetail() {
  const { id } = useParams({ from: "/os/$id" });
  const {
    os,
    records,
    summaryFields,
    hasRecords,
    isLoading,
    isError,
    isLoadingRecords,
    isErrorRecords,
  } = useOSDetail(decodeURIComponent(id));
  const [openModal, setOpenModal] = useState(false);

  if (isLoading) return <LoadingState />;
  if (isError || !os) return <ErrorState />;

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopNav />

      <DialogRegister os={os} open={openModal} onOpenChange={setOpenModal} />

      <main className="mx-auto max-w-[1400px] space-y-6 px-6 py-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/os" className="inline-flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5" />
                  Ordens de Serviço
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{os["Ordem de Serviço"]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div>
          <Badge variant="default">{os.tipo}</Badge>
          <h1 className="text-2xl font-semibold text-foreground">{os["Ordem de Serviço"]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {os.Contrato} · {os.Empresa}
          </p>
        </div>

        {/* Resumo — Accordion */}
        <Accordion type="single" collapsible defaultValue={hasRecords ? undefined : "summary"}>
          <AccordionItem value="summary" className="rounded-xl border border-border bg-card">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Resumo da OS</p>
                <p className="text-xs text-muted-foreground">
                  Dados do contrato e da operação em curso.
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {summaryFields.map(({ label, value }) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1 truncate text-sm font-semibold text-foreground">
                      {value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Registros de voo */}
        <FlightRecordsTable
          records={records}
          hasRecords={hasRecords}
          isLoading={isLoadingRecords}
          isError={isErrorRecords}
        />
      </main>

      <Button onClick={() => setOpenModal(true)} className="fixed bottom-8 right-8 z-20 gap-2">
        <Plus className="h-4 w-4" />
        Novo Registro
      </Button>
    </div>
  );
}

// ── Estados de loading e

function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-[1400px] space-y-6 px-6 py-10">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </main>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-[1400px] space-y-4 px-6 py-10">
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
