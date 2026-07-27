import { TopNav } from "@/components/top-nav";
import { ordensDeServico } from "@/lib/mock-data";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ChevronRight, MapPin, Plane, Search } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Operação aérea
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Ordens de Serviço</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecione a OS da sua operação atual para registrar horas de voo.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Stat label="OS vigentes" value="3" tone="success" />
            <Stat label="Encerradas" value="1" tone="muted" />
            <Stat label="Horas registradas" value="428:30" tone="primary" />
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar por código, contrato ou empresa..."
              className="h-12 w-full rounded-[10px] border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {ordensDeServico.map((os) => (
            <Link
              key={os.id}
              to="/os/$id"
              params={{ id: os.id }}
              className="group relative flex items-center gap-6 overflow-hidden rounded-xl border border-border bg-card p-5 pl-6 shadow-[0_1px_2px_rgba(6,29,43,0.04)] transition-all hover:border-primary/40 hover:bg-primary-soft/40 hover:shadow-[0_8px_24px_-8px_rgba(6,29,43,0.12)]"
            >
              <span aria-hidden className="absolute inset-y-3 left-0 w-1 rounded-full bg-primary" />

              <div className="hidden shrink-0 sm:block">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Plane className="h-5 w-5" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-lg font-semibold text-foreground">{os.codigo}</span>
                  <span className="text-sm text-muted-foreground">· {os.contrato}</span>
                  <StatusBadge status={os.status} />
                  <TipoBadge tipo={os.tipo} />
                </div>
                <div className="mt-1 text-base font-medium text-foreground">
                  <Building2 className="mr-1.5 inline h-4 w-4 text-muted-foreground" />
                  {os.empresa}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {os.base}
                  </span>
                  <span className="truncate">{os.objetivo}</span>
                </div>
              </div>

              <ChevronRight className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary md:block" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "muted" | "primary";
}) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "primary" ? "text-primary" : "text-foreground";
  return (
    <div className="flex flex-col">
      <span className={`text-xl font-semibold ${toneClass}`}>{value}</span>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: "Vigente" | "Encerrado" }) {
  if (status === "Vigente") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Vigente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
      Encerrado
    </span>
  );
}

function TipoBadge({ tipo }: { tipo: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
      {tipo}
    </span>
  );
}
