import "dotenv/config";

export const azureConfig = {
  clientId: process.env.AZURE_CLIENT_ID!,
  tenantId: process.env.AZURE_TENANT_ID!,
  clientSecret: process.env.AZURE_CLIENT_SECRET!,
  authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
};

// Excel 1 — SharePoint (CONTROLE DE AERONAVE DIVA.xlsx)
// Leitura dos acionamentos/OS — tbAcionamentoVoosAR e tbAcionamentoVoosAF
export const osExcelConfig = {
  driveId: process.env.SP_DRIVE_ID_OS!,
  itemId: process.env.SP_ITEM_ID_OS!,
  tables: {
    acionamentoAR: "Tabela12",
    acionamentoAF: "Tabela7",
  },
};

// Excel 2 — OneDrive (excel de controle de horas)
// Leitura e escrita de registros — tbControleVoosAR, tbControleVoosAF, tbUC
export const ctrlExcelConfig = {
  driveId: process.env.SP_DRIVE_ID_CTRL!,
  itemId: process.env.SP_ITEM_ID_CTRL!,
  tables: {
    voosAR: "tbControleVoosAR",
    voosAF: "tbControleVoosAF",
    ucs: "tbUC",
  },
};
