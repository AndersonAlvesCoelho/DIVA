export type OS = {
  id: string;
  codigo: string;
  contrato: string;
  sei: string;
  empresa: string;
  status: "Vigente" | "Encerrado";
  tipo: "Asa Rotativa" | "Asa Fixa";
  base: string;
  objetivo: string;
  unidadeSolicitante: string;
  formularioSei: string;
  horasAcionadas: string;
  prefixos: string;
  modelo: string;
  unidade: string;
  bioma: string;
  inicio: string;
  fim: string;
};

export const ordensDeServico: OS[] = [
  {
    id: "os-10",
    codigo: "OS 10 / 2024",
    contrato: "Contrato 023590240",
    sei: "SEI 02070.005912/2024-31",
    empresa: "Helibras Serviços Aéreos S.A.",
    status: "Vigente",
    tipo: "Asa Rotativa",
    base: "Base Aérea — Brasília / DF",
    objetivo: "Combate a incêndios florestais no Cerrado — Chapada dos Veadeiros.",
    unidadeSolicitante: "CGPRO / DIVA",
    formularioSei: "SEI 02070.005912/2024-31",
    horasAcionadas: "120h",
    prefixos: "PR-DIV, PR-AER",
    modelo: "Airbus H125 Esquilo",
    unidade: "PARNA Chapada dos Veadeiros",
    bioma: "Cerrado",
    inicio: "02/07/2024",
    fim: "30/09/2024",
  },
  {
    id: "os-11",
    codigo: "OS 11 / 2024",
    contrato: "Contrato 023590241",
    sei: "SEI 02070.006014/2024-08",
    empresa: "Voar Táxi Aéreo Ltda.",
    status: "Vigente",
    tipo: "Asa Fixa",
    base: "Base Aérea — Manaus / AM",
    objetivo: "Monitoramento de desmatamento na Amazônia Ocidental.",
    unidadeSolicitante: "CGPRO / DIVA",
    formularioSei: "SEI 02070.006014/2024-08",
    horasAcionadas: "200h",
    prefixos: "PT-ICM",
    modelo: "Cessna 208 Caravan",
    unidade: "REBIO Uatumã",
    bioma: "Amazônia",
    inicio: "15/06/2024",
    fim: "15/12/2024",
  },
  {
    id: "os-09",
    codigo: "OS 09 / 2024",
    contrato: "Contrato 023590239",
    sei: "SEI 02070.005311/2024-77",
    empresa: "Omni Táxi Aéreo S.A.",
    status: "Encerrado",
    tipo: "Asa Rotativa",
    base: "Base Aérea — Cuiabá / MT",
    objetivo: "Operação de fiscalização no Pantanal.",
    unidadeSolicitante: "CGPRO / DIVA",
    formularioSei: "SEI 02070.005311/2024-77",
    horasAcionadas: "80h",
    prefixos: "PR-OMN",
    modelo: "Bell 407",
    unidade: "PARNA Pantanal Matogrossense",
    bioma: "Pantanal",
    inicio: "10/03/2024",
    fim: "20/06/2024",
  },
  {
    id: "os-08",
    codigo: "OS 08 / 2024",
    contrato: "Contrato 023590238",
    sei: "SEI 02070.004410/2024-12",
    empresa: "Líder Aviação Táxi Aéreo",
    status: "Vigente",
    tipo: "Asa Fixa",
    base: "Base Aérea — Rio Branco / AC",
    objetivo: "Apoio logístico às brigadas Prevfogo no Acre.",
    unidadeSolicitante: "CGPRO / DIVA",
    formularioSei: "SEI 02070.004410/2024-12",
    horasAcionadas: "150h",
    prefixos: "PT-LID, PT-LDA",
    modelo: "Beechcraft King Air B200",
    unidade: "PARNA Serra do Divisor",
    bioma: "Amazônia",
    inicio: "01/05/2024",
    fim: "31/10/2024",
  },
];

export const getOS = (id: string) => ordensDeServico.find((o) => o.id === id);

export type Registro = {
  id: string;
  data: string;
  prefixo: string;
  piloto: string;
  horaInicio: string;
  horaFim: string;
  tempo: string;
  decimais: string;
  plantao: boolean;
};

export const registros: Registro[] = [
  {
    id: "r1",
    data: "14/08/2024",
    prefixo: "PR-DIV",
    piloto: "Cmte. Ricardo Andrade",
    horaInicio: "07:30",
    horaFim: "09:45",
    tempo: "02:15",
    decimais: "2,25",
    plantao: false,
  },
  {
    id: "r2",
    data: "14/08/2024",
    prefixo: "PR-DIV",
    piloto: "Cmte. Ricardo Andrade",
    horaInicio: "13:10",
    horaFim: "15:40",
    tempo: "02:30",
    decimais: "2,50",
    plantao: false,
  },
  {
    id: "r3",
    data: "15/08/2024",
    prefixo: "PR-AER",
    piloto: "Cmte. Juliana Mota",
    horaInicio: "—",
    horaFim: "—",
    tempo: "01:00",
    decimais: "1,00",
    plantao: true,
  },
];
