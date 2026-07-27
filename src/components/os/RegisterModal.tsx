import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { OSReal } from "@/types/os";
import { calcTempo } from "@/utils/utils";
import { Info, Plus, X } from "lucide-react";
import { useState } from "react";

// ── Tipos ───────────────────────────────────────────────────────────────────

type VooRow = {
  id: string;
  horaInicio: string;
  horaFim: string;
  plantao: boolean;
};

interface CamposComuns {
  prefixo: string;
  data: string;
  piloto: string;
  unidade: string;
}

interface DialogRegisterProps {
  os: OSReal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (voos: VooRow[], campos: CamposComuns) => void;
}

// ── Componente principal ────────────────────────────────────────────────────

export function DialogRegister({ os, open, onOpenChange, onSave }: DialogRegisterProps) {
  const [voos, setVoos] = useState<VooRow[]>([
    { id: "v1", horaInicio: "", horaFim: "", plantao: false },
  ]);

  const [campos, setCampos] = useState<CamposComuns>({
    prefixo: "",
    data: new Date().toISOString().split("T")[0],
    piloto: "",
    unidade: os.Unidade ?? "",
  });

  const updateCampo = (key: keyof CamposComuns, value: string) =>
    setCampos((prev) => ({ ...prev, [key]: value }));

  const updateVoo = (id: string, patch: Partial<VooRow>) =>
    setVoos((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  const addVoo = () =>
    setVoos((prev) => [
      ...prev,
      { id: `v${Date.now()}`, horaInicio: "", horaFim: "", plantao: false },
    ]);

  const removeVoo = (id: string) => setVoos((prev) => prev.filter((v) => v.id !== id));

  const handleSave = () => {
    const voosPreenchidos = voos.filter((v) => v.plantao || (v.horaInicio && v.horaFim));
    onSave?.(voosPreenchidos, campos);
    onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] max-w-[820px] flex-col overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-semibold">Registrar Horas de Voo</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {os["Ordem de Servico"]} · {os.Contrato}
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* Seção 01 — Campos comuns */}
          <section>
            <SectionTitle
              index="01"
              title="Campos Comuns"
              subtitle="Aplicados a todos os voos deste registro."
            />
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Prefixo">
                <Input
                  placeholder="XX-XXX"
                  maxLength={6}
                  value={campos.prefixo}
                  onChange={(e) => updateCampo("prefixo", e.target.value.toUpperCase())}
                />
              </Field>
              <Field label="Data">
                <Input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={campos.data}
                  onChange={(e) => updateCampo("data", e.target.value)}
                />
              </Field>
              <Field label="Piloto">
                <Input
                  placeholder="Nome do piloto"
                  value={campos.piloto}
                  onChange={(e) => updateCampo("piloto", e.target.value)}
                />
              </Field>
              <Field label="Unidade de Conservação">
                <Input
                  value={campos.unidade}
                  onChange={(e) => updateCampo("unidade", e.target.value)}
                  placeholder="UC"
                />
              </Field>
            </div>
          </section>

          {/* Seção 02 — Voos */}
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
                          <Input
                            type="time"
                            disabled={v.plantao}
                            value={v.horaInicio}
                            onChange={(e) => updateVoo(v.id, { horaInicio: e.target.value })}
                            className="h-9"
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <Input
                            type="time"
                            disabled={v.plantao}
                            value={v.horaFim}
                            onChange={(e) => updateVoo(v.id, { horaFim: e.target.value })}
                            className="h-9"
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
                            onCheckedChange={(checked) =>
                              updateVoo(v.id, {
                                plantao: checked,
                                horaInicio: checked ? "" : v.horaInicio,
                                horaFim: checked ? "" : v.horaFim,
                              })
                            }
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVoo(v.id)}
                            aria-label="Remover linha"
                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={addVoo}
              className="mt-3 text-primary hover:bg-primary-soft hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              Adicionar Voo
            </Button>
          </section>

          {/* Nota */}
          <div className="flex items-start gap-2.5 rounded-md bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Os campos <span className="font-semibold text-foreground">Tempo de Voo</span> e{" "}
            <span className="font-semibold text-foreground">Decimais</span> são calculados
            automaticamente.
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-border bg-muted/40 px-6 py-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Registros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Componentes auxiliares ──────────────────────────────────────────────────

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </Label>
  );
}
