import { excelConfig } from "@/auth/authConfig";
import { excelService } from "@/services/excelService";
import type { FlightRecord, UCOption } from "@/types/flightRecord";
import type { OSReal } from "@/types/os";
import { buildFlightRecords } from "@/utils/excel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, UseFieldArrayReturn, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useUCs } from "./useUCs";

const itemId = excelConfig.driveItemId;

// ── Utilitário ───────────────────────────────────────────────────────────────

function getTableName(tipo: OSReal["tipo"]): string {
  return tipo === "Rotativa"
    ? excelConfig.tables.controleRotativa
    : excelConfig.tables.controleFixa;
}

// ── Schema ───────────────────────────────────────────────────────────────────

const flightRowSchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  standby: z.boolean(),
  ucs: z.array(z.string()).min(1, "Selecione ao menos uma UC"),
});

const formSchema = z.object({
  prefix: z
    .string()
    .min(1, "Prefixo obrigatório")
    .regex(/^[A-Z0-9]{2}-[A-Z0-9]{3}$/, "Formato inválido. Use XX-XXX"),
  date: z.string().min(1, "Data obrigatória"),
  pilot: z.string(),
  rows: z
    .array(flightRowSchema)
    .min(1)
    .refine((rows) => rows.some((r) => r.standby || (r.startTime && r.endTime)), {
      message: "Preencha pelo menos um voo ou marque plantão",
    }),
});

export type FlightFormValues = z.infer<typeof formSchema>;

interface UseFlightFormsReturn {
  form: UseFormReturn<FlightFormValues>;
  fields: UseFieldArrayReturn<FlightFormValues, "rows", "id">["fields"];
  append: UseFieldArrayReturn<FlightFormValues, "rows", "id">["append"];
  remove: UseFieldArrayReturn<FlightFormValues, "rows", "id">["remove"];
  isPending: boolean;
  ucOptions: UCOption[];
  isLoadingUCs: boolean;
  handleSubmit: (values: FlightFormValues) => void;
  handleCancel: () => void;
}

export default function useFlightForms(
  os: OSReal,
  onOpenChange: (open: boolean) => void,
): UseFlightFormsReturn {
  const queryClient = useQueryClient();
  const { options: ucOptions, isLoading: isLoadingUCs } = useUCs();

  // Formulário
  const form = useForm<FlightFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prefix: "",
      date: new Date().toISOString().split("T")[0],
      pilot: "",
      rows: [{ id: "r1", startTime: "", endTime: "", standby: false, ucs: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rows",
  });

  // Mutation de salvar
  const { mutate: save, isPending } = useMutation({
    mutationFn: async (rows: FlightRecord[]) => {
      const tableName = getTableName(os.tipo);
      await Promise.all(
        rows.map((row) =>
          excelService.addTableRow(itemId, tableName, [
            row.Contrato, // 1  Contrato
            row.Empresa, // 2  Empresa
            row["Unidade Solicitante"], // 3  Unidade Solicitante
            row.Acionamento, // 4  Acionamento
            row.Base, // 5  Base
            row["Status do Contrato"], // 6  Status do Contrato
            row["Data do Voo"], // 7  Data do Voo
            row.Partida, // 8  Partida
            row.Corte, // 9  Corte
            row["Tempo de Voo"], // 10 Tempo de Voo
            row.Decimais, // 11 Decimais
            row.Plantão, // 12 Plantão
            row.Objetivo, // 13 Objetivo
            row.Bioma, // 14 Bioma
            row.Unidade, // 15 Unidade
            "", // 16 CNUC — vazio por enquanto
            row["Modelo - Aeronave"], // 17 Modelo - Aeronave
            row["Prefixo Aeronave"], // 18 Prefixo
            "", // 19 AGENTE
            "", // 20 Nota Fiscal
            "", // 21 TRP
            "", // 22 Relatorio de Voo
          ]),
        ),
      );
      return rows;
    },
    onSuccess: (savedRows) => {
      toast.success("Registros salvos com sucesso!");
      form.reset();
      onOpenChange(false);

      // Atualiza cache incrementalmente sem refetch
      const queryKey = ["flightRecords", os.tipo, os["Ordem de Serviço"]];
      queryClient.setQueryData<FlightRecord[]>(queryKey, (old) => [...(old ?? []), ...savedRows]);
    },
    onError: (error) => {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar os registros. Tente novamente.");
    },
  });

  const handleSubmit = (values: FlightFormValues) => {
    const records = buildFlightRecords(os, values.rows, {
      prefix: values.prefix,
      date: values.date,
      pilot: values.pilot,
    });
    const tableName = getTableName(os.tipo);
    console.log("tableName ", tableName);
    console.log("records ", records);

    save(records); /*  */
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return {
    form,
    fields,
    append,
    remove,
    isPending,
    ucOptions,
    isLoadingUCs,
    handleSubmit,
    handleCancel,
  };
}
