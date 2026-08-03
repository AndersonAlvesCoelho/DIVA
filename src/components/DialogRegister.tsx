import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useFlightForms from "@/hooks/useFlightForms";
import type { OSReal } from "@/types/os";
import { calcFlightTime } from "@/utils/excel";
import { maskAircraftPrefix } from "@/utils/mask";
import { Info, Plus, X } from "lucide-react";
import { MultiSelect } from "./MultiSelect";

interface DialogRegisterProps {
  os: OSReal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogRegister({ os, open, onOpenChange }: DialogRegisterProps) {
  const {
    form,
    fields,
    append,
    remove,
    isPending,
    ucOptions,
    isLoadingUCs,
    handleSubmit,
    handleCancel,
  } = useFlightForms(os, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] max-w-[820px] flex-col overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-semibold">Registrar Horas de Voo</DialogTitle>

          <DialogDescription>
            {os["Ordem de Serviço"]} · {os.Contrato}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}

            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              {/* Seção 01 — Campos comuns */}

              <section>
                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary-soft text-xs font-bold text-primary">
                    01
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Campos Comuns</h4>

                    <p className="text-xs text-muted-foreground">
                      Aplicados a todos os voos deste registro
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Prefixo *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="XX-XXX"
                            maxLength={6}
                            {...field}
                            onChange={(e) =>
                              field.onChange(maskAircraftPrefix(e.target.value.toUpperCase()))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Data *
                        </FormLabel>

                        <FormControl>
                          <Input
                            type="date"

                            max={new Date().toISOString().split("T")[0]}

                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}

                    name="pilot"

                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Piloto
                        </FormLabel>

                        <FormControl>
                          <Input placeholder="Nome do piloto" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Seção 02 — Voos */}

              <section>
                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary-soft text-xs font-bold text-primary">
                    02
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Voos</h4>

                    <p className="text-xs text-muted-foreground">
                      Adicione um trecho por linha. Marque plantão quando aplicável
                    </p>
                  </div>
                </div>

                {form.formState.errors.rows?.root && (
                  <p className="mt-2 text-xs text-destructive">
                    {form.formState.errors.rows.root.message}
                  </p>
                )}

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
                      {fields.map((field, index) => {
                        const row = form.watch(`rows.${index}`);

                        const { hhmm, decimal } = row.standby
                          ? { hhmm: "01:00", decimal: "1,00" }
                          : calcFlightTime(row.startTime, row.endTime);

                        return (
                          <tr key={field.id} className="border-t border-border">
                            <td className="px-3 py-2.5">
                              <FormField
                                control={form.control}

                                name={`rows.${index}.startTime`}

                                render={({ field }) => (
                                  <Input
                                    type="time"

                                    disabled={row.standby}

                                    className="h-9"

                                    {...field}
                                  />
                                )}
                              />
                            </td>

                            <td className="px-3 py-2.5">
                              <FormField
                                control={form.control}

                                name={`rows.${index}.endTime`}

                                render={({ field }) => (
                                  <Input
                                    type="time"

                                    disabled={row.standby}

                                    className="h-9"

                                    {...field}
                                  />
                                )}
                              />
                            </td>

                            <td className="px-3 py-2.5 w-48 max-w-48">
                              <FormField
                                control={form.control}

                                name={`rows.${index}.ucs`}

                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <MultiSelect
                                        value={field.value}

                                        onValueChange={field.onChange}

                                        options={ucOptions}

                                        placeholder={
                                          isLoadingUCs ? "Carregando UCs..." : "Selecione as UCs"
                                        }

                                        disabled={isLoadingUCs}
                                      />
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>

                            <td className="px-3 py-2.5">
                              <div className="flex h-9 items-center rounded-md bg-muted px-3 font-mono text-sm font-semibold text-foreground">
                                {hhmm}
                              </div>
                            </td>

                            <td className="px-3 py-2.5">
                              <div className="flex h-9 items-center rounded-md bg-muted px-3 font-mono text-sm text-foreground">
                                {decimal}
                              </div>
                            </td>

                            <td className="px-3 py-2.5">
                              <FormField
                                control={form.control}

                                name={`rows.${index}.standby`}

                                render={({ field }) => (
                                  <Switch
                                    checked={field.value}

                                    onCheckedChange={(checked) => {
                                      field.onChange(checked);

                                      if (checked) {
                                        form.setValue(`rows.${index}.startTime`, "");

                                        form.setValue(`rows.${index}.endTime`, "");
                                      }
                                    }}
                                  />
                                )}
                              />
                            </td>

                            <td className="px-3 py-2.5">
                              <Button
                                type="button"

                                variant="ghost"

                                size="icon"

                                onClick={() => remove(index)}

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
                  type="button"

                  variant="ghost"

                  size="sm"

                  onClick={() =>
                    append({
                      id: `r${Date.now()}`,

                      startTime: "",

                      endTime: "",

                      standby: false,

                      ucs: [],
                    })
                  }

                  className="mt-3 text-primary hover:bg-primary-soft hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Voo
                </Button>
              </section>

              <div className="flex items-start gap-2.5 rounded-md bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Os campos <span className="font-semibold text-foreground">Tempo de Voo</span> e{" "}
                <span className="font-semibold text-foreground">Decimais</span> são calculados
                automaticamente.
              </div>
            </div>

            <DialogFooter className="border-t border-border bg-muted/40 px-6 py-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar Registros"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
