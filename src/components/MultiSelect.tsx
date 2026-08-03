import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { useState } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Selecione...",
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 200);

  const filtered = debouncedSearch
    ? options.filter((opt) => opt.label.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : options;

  const toggle = (optValue: string) => {
    const next = value.includes(optValue)
      ? value.filter((v) => v !== optValue)
      : [...value, optValue];

    onValueChange(next);
  };

  const remove = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();

    onValueChange(value.filter((v) => v !== optValue));
  };

  const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label ?? v);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}

          className={cn(
            "h-auto min-h-9 w-full justify-between px-3 py-1.5 font-normal",
            !value.length && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex flex-wrap gap-1">
            {value.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selectedLabels.map((label, i) => (
                <Badge key={i} variant="secondary" className="max-w-28 gap-1 pr-1 text-xs ">
                  <span className="truncate">{label}</span>
                  <button
                    type="button"
                    onClick={(e) => remove(value[i], e)}
                    className="ml-0.5 rounded-sm opacity-60 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="min-w-[var(--radix-popover-trigger-width)] w-auto max-w-xs p-0"
        align="start"
        onWheel={(e) => e.stopPropagation()}
        onInteractOutside={() => {
          setOpen(false);
          setSearch("");
        }}
      >
        {/* Search */}
        <div className="flex items-center border-b border-border px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar..."
            className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Lista */}

        <ScrollArea className="h-60 ">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma opção encontrada.
            </div>
          ) : (
            <div className="p-1">
              {filtered.map((opt) => {
                const selected = value.includes(opt.value);

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                      selected && "font-medium text-primary",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40",
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </div>

                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}

        {value.length > 0 && (
          <div className="border-t border-border p-2">
            <button
              type="button"
              onClick={() => onValueChange([])}
              className="w-full rounded-sm px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Limpar seleção ({value.length})
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
