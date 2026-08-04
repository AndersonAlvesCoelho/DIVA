# DIVA / ICMBio

> Sistema web de registro e controle de horas de voo da Divisão de Operações Aéreas do ICMBio.

<!-- Substitua pela screenshot do projeto -->

![Altas Horas Preview](public\print.png)

🔗 **[diva-beige.vercel.app](https://diva-beige.vercel.app)**

---

## Sobre o projeto

O Altas Horas substitui o fluxo manual de planilhas Excel individuais por uma aplicação web que permite aos agentes de campo da DIVA registrar horas de voo diretamente, com gravação automática na Planilha Master via Microsoft Graph API.

Os dados permanecem integralmente no ambiente Microsoft do ICMBio — OneDrive/SharePoint — sem banco de dados externo.

---

## Stack

| Camada         | Tecnologia                                   |
| -------------- | -------------------------------------------- |
| Frontend       | React 19 + TypeScript + Vite                 |
| Roteamento     | TanStack Router                              |
| Estado e cache | TanStack Query                               |
| Estilização    | Tailwind CSS v4 + shadcn/ui                  |
| Autenticação   | MSAL.js — Microsoft Entra ID (Single Tenant) |
| API de dados   | Microsoft Graph API v1.0                     |
| Armazenamento  | Excel Online — OneDrive/SharePoint ICMBio    |
| Deploy         | Vercel                                       |

---

## Pré-requisitos

- Node.js 18+
- Conta `@icmbio.gov.br` com acesso ao OneDrive
- App `PROJECT_NAME` registrado no Microsoft Entra ID do tenant ICMBio

---

## Como rodar localmente

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/DIVA.git
cd DIVA
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_MSAL_CLIENT_ID=
VITE_MSAL_TENANT_ID=
VITE_EXCEL_DRIVE_ITEM_ID=
```

**4. Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse `http://localhost:8080`

---

## Estrutura do projeto

```
src/
├── auth/           — MSAL config, AuthProvider, UserContext
├── components/     — TopNav, OSCard, FlightRecordsTable, RegisterModal, MultiSelect
├── hooks/          — useOSList, useOSDetail, useFlightForms, useUCs, useDebounce
├── routes/         — Páginas: / (login), /os (lista), /os/$id (detalhes)
├── services/       — graphApi (axios + interceptor), excelService, userService
├── types/          — OSReal, FlightRecord, UCOption
└── utils/          — excel, os, flightRecord, utils
```

---

## Módulos

| Módulo   | Status        | Descrição                                       |
| -------- | ------------- | ----------------------------------------------- |
| Módulo 1 | ⚠️ Em Analise | Registro de horas de voo pelos agentes de campo |
| Módulo 2 | 🔜 Planejado  | Solicitação de contratos entre divisões         |
| Módulo 3 | 🔜 Planejado  | Integração com o SEI                            |
| Módulo 4 | 🔜 Planejado  | Dashboard gerencial                             |

---

## Licença

Uso interno ICMBio — Instituto Chico Mendes de Conservação da Biodiversidade.
