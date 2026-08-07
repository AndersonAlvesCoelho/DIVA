import { OSNormalized } from "../types/os";
import { getOSRotativa, getOSFixa } from "./graphService";

function parseExcelDate(value: unknown): string | null {
  if (!value && value !== 0) return null;
  if (typeof value === "number") {
    const date = new Date(new Date(1899, 11, 30).getTime() + value * 86400000);
    return date.toLocaleDateString("pt-BR");
  }
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function parseHoras(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseFloat(value.replace(",", "."));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function str(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeRotativa(raw: Record<string, unknown>): OSNormalized {
  return {
    contrato: str(raw["Contrato"]),
    empresa: str(raw["Empresa"]),
    ordemDeServico: str(raw["Ordem de Serviço"]),
    formulario: str(raw["Formulário"]),
    tipo: "Rotativa",
    unidadeSolicitante: str(raw["Unidade Solicitante"]),
    base: str(raw["Base"]),
    objetivo: str(raw["Objetivo"]),
    status: str(raw["Status do Acionamento"]),
    statusContrato: str(raw["Status do Contrato"]),
    tipoAeronave: str(raw["Tipo de Aeronave"]),
    modeloAeronave: str(raw["Modelo da Aeronave"]),
    prefixo: str(raw["Prefixo Aeronaves."]),
    unidade: str(raw["Unidade de Conservação"]),
    cnuc: str(raw["CNUC"]),
    bioma: str(raw["Bioma"]),
    inicioOperacao: parseExcelDate(raw["Inicio da Operação"]),
    finalOperacao: parseExcelDate(raw["Final da Operação"]),
    quantDias: Number(raw["Quant. Dias"] ?? 0),
    quantAeronaves: Number(raw["Quant. Aeronaves"] ?? 0),
    horasAcionadas: parseHoras(raw["Horas Acionadas"]),
    totalHorasVoadas: str(raw["Total de Horas Voadas"]),
    horasRemanescentes: str(raw["Horas Remanescentes"]),
    fonteOrcamentaria: str(raw["Fonte Orçamentária "]),
    numeroEmpenho: str(raw["Numero do Empenho"]),
    valorHoraVoo: parseHoras(raw["Valor Hora/Voo"]),
    valorEstimado: parseHoras(raw["Valor Estimado"]),
  };
}

function normalizeFixa(raw: Record<string, unknown>): OSNormalized {
  return {
    contrato: str(raw["Contrato"]),
    empresa: str(raw["Empresa"]),
    ordemDeServico: str(raw["Ordem de Serviço"]),
    formulario: str(raw["Formulário"]),
    tipo: "Fixa",
    unidadeSolicitante: str(raw["Unidade Solicitante"]),
    base: str(raw["Base"]),
    objetivo: str(raw["Objetivo"]),
    status: str(raw["Status"]),
    statusContrato: str(raw["Status do Contrato"]),
    tipoAeronave: str(raw["Tipo de Aeronave"]),
    modeloAeronave: str(raw["Modelo da Aeronave"]),
    prefixo: str(raw["Prefixo Aeronaves."]),
    unidade: str(raw["Unidade"]),
    cnuc: str(raw["CNUC"]),
    bioma: str(raw["Bioma"]),
    inicioOperacao: parseExcelDate(raw["Inicio da Operação"]),
    finalOperacao: parseExcelDate(raw["Final da Operação"]),
    quantDias: Number(raw["Quant. Dias"] ?? 0),
    quantAeronaves: Number(raw["Quant. Aeronaves"] ?? 0),
    horasAcionadas: parseHoras(raw["Horas Acionadas"]),
    totalHorasVoadas: str(raw["Total de Horas Voadas"]),
    horasRemanescentes: str(raw["Horas Remanescentes"]),
    fonteOrcamentaria: str(raw["Fonte Orçamentária "]),
    numeroEmpenho: str(raw["Numero do Empenho"]),
    valorHoraVoo: parseHoras(raw["Valor Hora/Voo"]),
    valorEstimado: parseHoras(raw["Valor Estimado"]),
  };
}

export async function listAllOS(): Promise<OSNormalized[]> {
  const [rotativa, fixa] = await Promise.all([getOSRotativa(), getOSFixa()]);
  return [...rotativa.map(normalizeRotativa), ...fixa.map(normalizeFixa)];
}

export async function listOSRotativa(): Promise<OSNormalized[]> {
  return (await getOSRotativa()).map(normalizeRotativa);
}

export async function listOSFixa(): Promise<OSNormalized[]> {
  return (await getOSFixa()).map(normalizeFixa);
}
