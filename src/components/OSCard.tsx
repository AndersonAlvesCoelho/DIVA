import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OSComPriority } from "@/utils/excel";
import { parseHoras } from "@/utils/helper";
import { formatDateBR, parseDateBR } from "@/utils/utils";
import { Calendar, Helicopter, MapPin, Plane } from "lucide-react";

// ── Config de prioridade
const prioridadeConfig = {
  1: {
    label: "Em operação",
    badgeClass: "bg-success-soft text-success hover:bg-success-soft",
    borderClass: "border-success/40 hover:border-success/70",
    borderSelecionada: "border-success ring-2 ring-success/30",
  },
  2: {
    label: "Prevista",
    badgeClass: "bg-primary-soft text-primary hover:bg-primary-soft",
    borderClass: "border-border hover:border-primary/40",
    borderSelecionada: "border-primary ring-2 ring-primary/30",
  },
  3: {
    label: "Concluída",
    badgeClass: "bg-muted text-muted-foreground hover:bg-muted",
    borderClass: "border-border opacity-60 hover:opacity-80",
    borderSelecionada: "border-primary ring-2 ring-primary/30 opacity-100",
  },
} as const;

// ── Props

interface OSCardProps {
  os: OSComPriority;
  selecionada: boolean;
  onSelecionar: () => void;
}

export default function OSCard({ os, selecionada, onSelecionar }: OSCardProps) {
  const config = prioridadeConfig[os.prioridade];
  const vigente = os["Status do Contrato"] === "Vigente";
  const horas = parseFloat(parseHoras(os["Horas Acionadas"]).toFixed(2));
  const progresso = Math.min((horas / 100) * 100, 100); // ajustar quando tiver total real

  return (
    <Card
      onClick={onSelecionar}
      className={`cursor-pointer transition-all hover:shadow-md ${
        selecionada ? config.borderSelecionada : config.borderClass
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Ícone com cor por prioridade */}
          <div
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${
              os.prioridade === 1
                ? "bg-success-soft text-success"
                : os.prioridade === 2
                  ? "bg-primary-soft text-primary"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {os.tipo === "Fixa" ? (
              <Plane className="h-5 w-5" />
            ) : (
              <Helicopter className="h-5 w-5" />
            )}
          </div>

          {/* Título */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-foreground">{os["Ordem de Serviço"]}</span>
              <Badge variant={vigente ? "default" : "secondary"}>{os.tipo}</Badge>
              <Badge className={config.badgeClass}>{config.label}</Badge>
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{os.Empresa}</p>
          </div>

          {/* Indicador de seleção */}
          <div
            className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 transition-all ${
              selecionada ? "border-primary bg-primary" : "border-muted-foreground/30"
            }`}
          >
            {selecionada && (
              <svg viewBox="0 0 20 20" fill="white" className="h-full w-full p-0.5">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {/* Modelo + Prefixo */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Plane className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {os["Modelo da Aeronave"]}
            {os["Prefixo"] !== "Nao informado" && (
              <>
                {" · "}
                <span className="font-medium text-foreground">{os["Prefixo"]}</span>
              </>
            )}
          </span>
        </div>

        {/* Base */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>Base {os.Base}</span>
        </div>

        {/* Vigência */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>
            {formatDateBR(parseDateBR(os["Inicio da Operação"]))} – {os.endDateFormatted}
          </span>
        </div>

        {/* <Separator className="my-3" /> */}

        {/* Progresso de horas */}
        {/* <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Horas acionadas</span>
            <span className="font-semibold text-foreground">{horas}</span>
          </div>
          <Progress
            value={progresso}
            className={`h-2 ${os.prioridade === 3 ? "opacity-50" : ""}`}
          />
        </div> */}
      </CardContent>
    </Card>
  );
}
