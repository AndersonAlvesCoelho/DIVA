import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type PopoverSelectProps<T> = {
  label?: string;
  placeholder?: string;
  items: T[];
  value?: string | null;
  onSelect: (item: T | null) => void;
  displayField: keyof T;
  valueField: keyof T;
  totalCount?: number;
  hasMore?: boolean;
  hasMoreLoading?: boolean;
  onLoadMore?: () => void;
  onSearch?: (term: string) => void;
  emptyMessage?: string;
};

export function PopoverSelect<T extends { [key: string]: any }>({
  label,
  placeholder = "Selecione...",
  items,
  value,
  onSelect,
  displayField,
  valueField,
  totalCount = 0,
  hasMore = false,
  hasMoreLoading = false,
  onLoadMore,
  onSearch,
  emptyMessage = "Nenhum registro encontrado.",
}: PopoverSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const itemCacheRef = useRef<Map<string, T>>(new Map());

  const currentItem = items.find((i) => String(i[valueField]) === String(value));
  const cachedItem = itemCacheRef.current.get(String(value ?? ""));
  const selectedItem = currentItem ?? cachedItem ?? undefined;
  const displayValue = selectedItem
    ? String(selectedItem[displayField] ?? "")
    : (selectedLabel ?? placeholder);

  useEffect(() => {
    items.forEach((it) => {
      const key = String(it[valueField]);
      itemCacheRef.current.set(key, it);
    });
  }, [items, valueField]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedLabel(String(selectedItem[displayField] ?? ""));
    } else if (value === null || value === undefined || value === "") {
      setSelectedLabel(null);
    }
  }, [selectedItem, displayField, value]);

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}
      <Popover
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm cursor-pointer",
              "hover:bg-primary/10",
            )}
            onClick={() => setOpen((s) => !s)}
          >
            <span className="truncate">{displayValue}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 !z-50" align="start">
          <Command>
            <CommandInput
              placeholder="Buscar..."
              value={search}
              onValueChange={(val) => {
                setSearch(val);
                onSearch?.(val);
              }}
            />
            <CommandList>
              <CommandGroup>
                {items.length === 0 ? (
                  <div className="justify-center py-6 text-sm text-muted-foreground text-center w-full">
                    {search.trim() ? emptyMessage : "Ainda não há registros cadastrados."}
                  </div>
                ) : (
                  <>
                    {items.map((item) => {
                      const commandValue = `${String(item[displayField] ?? "")}___${String(item[valueField])}`;

                      return (
                        <CommandItem
                          key={String(item[valueField])}
                          value={commandValue}
                          onSelect={() => {
                            onSelect(item);
                            setSelectedLabel(String(item[displayField] ?? ""));
                            setOpen(false);
                          }}
                          className={cn(
                            "cursor-pointer px-3 py-2 rounded-lg text-sm transition-colors",
                            "data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary/80",
                            "hover:bg-primary hover:text-primary/90",
                          )}
                        >
                          <p className="font-medium">{String(item[displayField] ?? "")}</p>
                        </CommandItem>
                      );
                    })}
                    {hasMore && (
                      <div className="py-2 px-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            onLoadMore?.();
                          }}
                          disabled={hasMoreLoading}
                          className="w-full text-xs"
                        >
                          {hasMoreLoading ? (
                            <>
                              <Loader className="mr-2 h-3 w-3 animate-spin" />
                              Carregando...
                            </>
                          ) : (
                            `Carregar mais (${items.length} de ${totalCount})`
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
