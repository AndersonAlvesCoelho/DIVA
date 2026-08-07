import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FlightRecord } from "@/types/flightRecord";
import { formatFlightDate, formatFlightTime } from "@/utils/excel";
import { Clock, Plane, TrendingUp } from "lucide-react";

// ── Props
interface FlightRecordsTableProps {
  records: FlightRecord[];
  hasRecords: boolean;
  isLoading: boolean;
  isError: boolean;
}

// ── Métricas
function calcMetrics(records: FlightRecord[]) {
  let totalDecimal = 0;
  let standbyCount = 0;
  let flightCount = 0;

  records.forEach((r) => {
    const val = parseFloat(String(r.Decimais).replace(",", "."));
    if (!isNaN(val)) totalDecimal += val;
    if (r.Plantão == "1") standbyCount++;
    else flightCount++;
  });

  return {
    totalDecimal: totalDecimal.toFixed(2).replace(".", ","),
    totalRecords: records.length,
    standbyCount,
    flightCount,
  };
}

export function FlightRecordsTable({
  records,
  hasRecords,
  isLoading,
  isError,
}: FlightRecordsTableProps) {
  const metrics = hasRecords ? calcMetrics(records) : null;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm">Registros de Voo</CardTitle>
          <CardDescription>
            {isLoading ? "Carregando..." : `${records.length} registro(s) encontrado(s)`}
          </CardDescription>
        </div>

        {/* Métricas rápidas no header — só quando tem dados */}
        {metrics && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              <Clock className="mr-1 inline h-3.5 w-3.5" />
              <span className="font-semibold text-foreground">{metrics.totalDecimal}h</span>{" "}
              acumuladas
            </span>
            <span>
              <Plane className="mr-1 inline h-3.5 w-3.5" />
              <span className="font-semibold text-foreground">{metrics.flightCount}</span> voos ·{" "}
              <span className="font-semibold text-foreground">{metrics.standbyCount}</span> plantões
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {/* Loading */}
        {isLoading && (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </div>
        )}

        {/* Erro */}
        {!isLoading && isError && (
          <div className="p-6 text-center text-sm text-destructive">
            Erro ao carregar os registros de voo.
          </div>
        )}

        {/* Vazio */}
        {!isLoading && !isError && !hasRecords && (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
              <Plane className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Nenhum registro de voo</p>
            <p className="text-xs text-muted-foreground">
              Clique em "Novo Registro" para adicionar o primeiro voo desta OS.
            </p>
          </div>
        )}

        {/* Métricas + Tabela */}
        {hasRecords && metrics && (
          <>
            <div className="grid grid-cols-3 gap-px border-b border-t border-border bg-border">
              <MetricCard
                label="Total acumulado"
                value={`${metrics.totalDecimal}h`}
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <MetricCard
                label="Voos realizados"
                value={String(metrics.flightCount)}
                icon={<Plane className="h-4 w-4" />}
              />
              <MetricCard
                label="Plantões"
                value={String(metrics.standbyCount)}
                icon={<Clock className="h-4 w-4" />}
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Prefixo</TableHead>
                    <TableHead>Piloto</TableHead>
                    <TableHead>Partida</TableHead>
                    <TableHead>Corte</TableHead>
                    <TableHead>Tempo de Voo</TableHead>
                    <TableHead>Decimais</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {formatFlightDate(r["Data do Voo"])}
                      </TableCell>
                      <TableCell className="font-mono">{r["Prefixo Aeronave"]}</TableCell>
                      <TableCell>{r.Piloto}</TableCell>
                      <TableCell className="font-mono">{formatFlightTime(r.Partida)}</TableCell>
                      <TableCell className="font-mono">{formatFlightTime(r.Corte)}</TableCell>
                      <TableCell className="font-mono font-semibold">
                        {formatFlightTime(r["Tempo de Voo"])}
                      </TableCell>
                      <TableCell className="font-mono">{r.Decimais}</TableCell>
                      <TableCell>
                        {r.Plantão == "1" ? (
                          <Badge variant="outline" className="bg-warning-soft text-warning">
                            Plantão
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-success-soft text-success">
                            Voo
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ── MetricCard
function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 bg-card px-5 py-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
    </div>
  );
}
