import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  Home,
  Pencil,
  Plus,
  Trash2,
  X,
  Info,
} from "lucide-react";
import { TopNav } from "@/components/top-nav";
import { getOS, registros as mockRegistros, type Registro } from "@/lib/mock-data";

export const Route = createFileRoute("/os/$id")({
  loader: ({ params }) => {
    const os = getOS(params.id);
    if (!os) throw notFound();
    return { os };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.os.codigo} — AeroHoras`
          : "Ordem de Serviço — AeroHoras",
      },
      { name: "description", content: "Resumo da OS e registros de horas de voo." },
    ],
  }),
  component: OSDetail,
});

function OSDetail() {
  const { id } = useParams({ from: "/os/$id" });
  const os = getOS(id)!;
  const [openModal, setOpenModal] = useState(false);

  const campos: [string, string][] = [
    ["Contrato", os.contrato],
    ["Empresa", os.empresa],
    ["Status", os.status],
    ["Unidade Solicitante", os.unidadeSolicitante],
    ["Formulário SEI", os.formularioSei],
    ["Ordem de Serviço SEI", os.sei],
    ["Base", os.base],
    ["Horas Acionadas", os.horasAcionadas],
    ["Objetivo", os.objetivo],
    ["Prefixo Aeronaves", os.prefixos],
    ["Modelo da Aeronave", os.modelo],
    ["Unidade", os.unidade],
    ["Bioma", os.bioma],
    ["Início da Operação", os.inicio],
    ["Final da Operação", os.fim],
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopNav />

      <main className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            to="/os"
            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            Ordens de Serviço
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">
            {os.codigo} · {os.sei}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  os.status === "Vigente"
                    ? "bg-success-soft text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    os.status === "Vigente" ? "bg-success" : "bg-muted-foreground"
                  }`}
                />
                {os.status}
              </span>
              <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                {os.tipo}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{os.codigo}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {os.contrato} · {os.empresa}
            </p>
          </div>
        </div>

        {/* Summary card */}
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
                <dd className="mt-1 truncate text-sm font-semibold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Registros */}
        <section className="mt-8 rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(6,29,43,0.04)]">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-foreground">Registros de Voo</h2>
              <span className="inline-flex items-center rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                {mockRegistros.length} registros
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Total acumulado:{" "}
              <span className="font-semibold text-foreground">05:45 · 5,75h</span>
            </div>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/70 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Th>Data</Th>
                  <Th>Prefixo</Th>
                  <Th>Piloto</Th>
                  <Th>Hora Início</Th>
                  <Th>Hora Fim</Th>
                  <Th>Tempo de Voo</Th>
                  <Th>Decimais</Th>
                  <Th>Plantão</Th>
                  <Th className="text-right">Ações</Th>
                </tr>
              </thead>
              <tbody>
                {mockRegistros.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-t border-border ${
                      i % 2 === 1 ? "bg-muted/30" : "bg-card"
                    }`}
                  >
                    <Td className="font-medium text-foreground">{r.data}</Td>
                    <Td className="font-mono text-foreground">{r.prefixo}</Td>
                    <Td>{r.piloto}</Td>
                    <Td className="font-mono">{r.horaInicio}</Td>
                    <Td className="font-mono">{r.horaFim}</Td>
                    <Td className="font-mono font-semibold text-foreground">{r.tempo}</Td>
                    <Td className="font-mono">{r.decimais}</Td>
                    <Td>
                      {r.plantao ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: "var(--warning)" }}
                          />
                          Plantão
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          Voo
                        </span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <div className="inline-flex gap-1">
                        <IconBtn label="Editar">
                          <Pencil className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn label="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </IconBtn>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Floating button */}
      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-8 right-8 z-20 inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_rgba(0,84,128,0.55)] transition-all hover:opacity-95 hover:shadow-[0_12px_28px_-8px_rgba(0,84,128,0.65)]"
      >
        <Plus className="h-4 w-4" />
        Novo Registro
      </button>

      {openModal && <RegisterModal os={os} onClose={() => setOpenModal(false)} />}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-6 py-3 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-3.5 text-foreground/90 ${className}`}>{children}</td>;
}
function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

/* ----------- Modal ----------- */
type VooRow = {
  id: string;
  horaInicio: string;
  horaFim: string;
  plantao: boolean;
};

function calcTempo(inicio: string, fim: string): { hhmm: string; dec: string } {
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

function RegisterModal({
  os,
  onClose,
}: {
  os: ReturnType<typeof getOS>;
  onClose: () => void;
}) {
  const [voos, setVoos] = useState<VooRow[]>([
    { id: "v1", horaInicio: "07:30", horaFim: "09:45", plantao: false },
    { id: "v2", horaInicio: "13:10", horaFim: "15:40", plantao: false },
    { id: "v3", horaInicio: "", horaFim: "", plantao: false },
  ]);

  const updateVoo = (id: string, patch: Partial<VooRow>) =>
    setVoos((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  const addVoo = () =>
    setVoos((prev) => [
      ...prev,
      { id: `v${Date.now()}`, horaInicio: "", horaFim: "", plantao: false },
    ]);

  const removeVoo = (id: string) =>
    setVoos((prev) => prev.filter((v) => v.id !== id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-[#061D2B]/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[92vh] w-full max-w-[820px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Registrar Horas de Voo</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {os?.codigo} · {os?.contrato}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* Section 1 */}
          <section>
            <SectionTitle
              index="01"
              title="Campos Comuns"
              subtitle="Aplicados a todos os voos deste registro."
            />
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Prefixo">
                <input
                  className={inputClass}
                  placeholder="XX-XXX"
                  defaultValue="PR-DIV"
                />
              </Field>
              <Field label="Data">
                <input type="date" className={inputClass} defaultValue="2024-08-14" />
              </Field>
              <Field label="Piloto">
                <input
                  className={inputClass}
                  defaultValue="Cmte. Ricardo Andrade"
                />
              </Field>
              <Field label="Unidade de Conservação">
                <select className={inputClass} defaultValue="chapada">
                  <option value="chapada">PARNA Chapada dos Veadeiros</option>
                  <option value="pantanal">PARNA Pantanal Matogrossense</option>
                  <option value="uatuma">REBIO Uatumã</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <SectionTitle
              index="02"
              title="Voos"
              subtitle="Adicione um trecho por linha. Marque plantão quando aplicável."
            />

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/70 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2.5">Hora Início</th>
                    <th className="px-3 py-2.5">Hora Fim</th>
                    <th className="px-3 py-2.5">Tempo de Voo</th>
                    <th className="px-3 py-2.5">Decimais</th>
                    <th className="px-3 py-2.5">Plantão</th>
                    <th className="w-10 px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {voos.map((v) => {
                    const { hhmm, dec } = v.plantao
                      ? { hhmm: "01:00", dec: "1,00" }
                      : calcTempo(v.horaInicio, v.horaFim);
                    return (
                      <tr key={v.id} className="border-t border-border">
                        <td className="px-3 py-2.5">
                          <input
                            type="time"
                            disabled={v.plantao}
                            value={v.horaInicio}
                            onChange={(e) =>
                              updateVoo(v.id, { horaInicio: e.target.value })
                            }
                            className={compactInput}
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <input
                            type="time"
                            disabled={v.plantao}
                            value={v.horaFim}
                            onChange={(e) => updateVoo(v.id, { horaFim: e.target.value })}
                            className={compactInput}
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex h-9 items-center rounded-md bg-muted px-3 font-mono text-sm font-semibold text-foreground">
                            {hhmm}
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex h-9 items-center rounded-md bg-muted px-3 font-mono text-sm text-foreground">
                            {dec}
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <Switch
                            checked={v.plantao}
                            onChange={(checked) => updateVoo(v.id, { plantao: checked })}
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <button
                            onClick={() => removeVoo(v.id)}
                            aria-label="Remover linha"
                            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={addVoo}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-primary hover:bg-primary-soft"
            >
              <Plus className="h-4 w-4" />
              Adicionar Voo
            </button>
          </section>

          <div className="flex items-start gap-2.5 rounded-md bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Os campos <span className="font-semibold text-foreground">Tempo de Voo</span> e{" "}
            <span className="font-semibold text-foreground">Decimais</span> são calculados
            automaticamente.
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-3 border-t border-border bg-muted/40 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-[10px] border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Cancelar
          </button>
          <button className="rounded-[10px] bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95">
            Salvar Registros
          </button>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary-soft text-xs font-bold text-primary">
        {index}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-card shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

const inputClass =
  "h-10 w-full rounded-[10px] border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

const compactInput =
  "h-9 w-full rounded-md border border-border bg-card px-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:bg-muted disabled:text-muted-foreground";
