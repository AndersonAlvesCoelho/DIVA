export interface OSReal {
  Contrato: string;
  Empresa: string;
  "Status do Contrato": string;
  "Unidade Solicitante": string;
  Formulário: string;
  "Ordem de Serviço": string;
  Base: string;
  "Horas Acionadas": string | number;
  Objetivo: string;
  Unidade: string;
  CNUC: string;
  Bioma: string;
  "Inicio da Operação": string | number;
  "Final da Operação": string | number;
  "Quant. Dias": number;
  "Quant. Aeronaves": number;
  "Tipo de Aeronave": string;
  "Modelo da Aeronave": string;
  Prefixo: string;
  "Fonte Orçamentária ": string;
  "Numero do Empenho": string;
  "Valor Hora/Voo": number;
  "Valor Estimado": number;
  "Total de Horas Voadas": string;
  "Horas Remanescentes": string;
  Status: string;
  tipo: "Rotativa" | "Fixa";
}

export interface RegistroVoo {
  Contrato: string;
  Empresa: string;
  "Unidade Solicitante": string;
  Acionamento: string;
  Base: string;
  "Status do Contrato": string;
  "Data do Voo": string;
  Partida: string;
  Corte: string;
  "Tempo de Voo": string;
  Decimais: string;
  Plantão: string;
  Objetivo: string;
  Bioma: string;
  Unidade: string;
  "Modelo - Aeronave": string;
  "Prefixo Aeronave": string;
  Piloto: string;
}

export interface UseOSByIdReturn {
  os: OSReal | undefined;
  isLoading: boolean;
  isError: boolean;
}

export type OSStatus = "Vigente" | "Encerrado" | "Cancelado";
export type OSTipo = "Rotativa" | "Fixa";
