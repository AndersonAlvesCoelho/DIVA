export interface FlightRecord {
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

export interface FlightRowInput {
  id: string;
  startTime: string;
  endTime: string;
  standby: boolean;
  ucs: string[];
}

export interface CommonFields {
  prefix: string;
  date: string;
  pilot: string;
}

export interface UCRecord {
  "Nome Padrão": string;
  Código: string;
}

export interface UCOption {
  value: string;
  label: string;
}
