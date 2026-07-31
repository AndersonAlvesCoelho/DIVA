export interface OSReal {
  Contrato: string;
  Empresa: string;
  "Status do Contrato": string;
  "Unidade Solicitante": string;
  Formulario: string;
  "Ordem de Servico": string;
  Base: string;
  "Horas Acionadas": string;
  Objetivo: string;
  "Prefixo Aeronaves": string;
  "Modelo da Aeronave": string;
  Unidade: string;
  Bioma: string;
  "Inicio da Operacao": string;
  "Final da Operacao": string;
  "Quantidade de Dias": number;
  "Quantidade de Aeronaves": number;
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
