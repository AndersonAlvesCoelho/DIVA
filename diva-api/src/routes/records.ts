import { FastifyInstance } from "fastify";
import { ctrlExcelConfig } from "../config/azure";
import { AuthenticatedUser, authMiddleware } from "../middlewares/auth";
import { addFlightRecord, getFlightRecords } from "../services/graphService";
import { FlightRecordBody } from "../types/os";
import { calcFlightTime } from "../utils/help";

export async function recordsRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { tipo: string; acionamento: string } }>(
    "/:tipo/:acionamento",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Registros de Voo"],
        summary: "Busca registros de voo de uma OS",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            tipo: { type: "string", enum: ["Rotativa", "Fixa"] },
            acionamento: { type: "string" },
          },
          required: ["tipo", "acionamento"],
        },
      },
    },
    async (request, reply) => {
      const { tipo, acionamento } = request.params;
      return reply.send(
        await getFlightRecords(
          tipo as "Rotativa" | "Fixa",
          decodeURIComponent(acionamento),
        ),
      );
    },
  );

  fastify.post<{ Body: FlightRecordBody }>(
    "/",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Registros de Voo"],
        summary: "Adiciona registros de voo",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["os", "rows", "common"],
          properties: {
            os: { type: "object", additionalProperties: true },
            rows: { type: "array", items: { type: "object" } },
            common: { type: "object" },
          },
        },
      },
    },
    async (request, reply) => {
      const { os, rows, common } = request.body;
      const user = (request as any).user as AuthenticatedUser;
      const validRows = rows.filter(
        (r: any) => r.standby || (r.startTime && r.endTime),
      );

      await Promise.all(
        validRows.map((r: any) => {
          const { hhmm, decimal } = r.standby
            ? { hhmm: "01:00", decimal: "1,00" }
            : calcFlightTime(r.startTime, r.endTime);

          console.log("─── POST /records ───────────────────────────────");
          console.log("tipo:", os.tipo);
          console.log("driveId:", ctrlExcelConfig.driveId);
          console.log("itemId:", ctrlExcelConfig.itemId);
          console.log(
            "tableName:",
            os.tipo === "Rotativa"
              ? ctrlExcelConfig.tables.voosAR
              : ctrlExcelConfig.tables.voosAF,
          );

          const values =
            os.tipo === "Rotativa"
              ? [
                  os.contrato,
                  os.empresa,
                  os.unidadeSolicitante,
                  os.ordemDeServico,
                  os.base,
                  os.statusContrato,
                  common.date,
                  r.standby ? "" : r.startTime,
                  r.standby ? "" : r.endTime,
                  hhmm,
                  decimal,
                  r.standby ? "1" : "0",
                  os.objetivo,
                  os.bioma,
                  Array.isArray(r.ucs) ? r.ucs.join("; ") : (r.ucs ?? ""),
                  "",
                  os.modeloAeronave,
                  common.prefix,
                  user.email,
                  "",
                  "",
                  "",
                ]
              : [
                  os.contrato,
                  os.empresa,
                  os.statusContrato,
                  os.unidadeSolicitante,
                  os.ordemDeServico,
                  os.base,
                  common.date,
                  r.standby ? "" : r.startTime,
                  r.standby ? "" : r.endTime,
                  hhmm,
                  decimal,
                  r.standby ? "1" : "0",
                  os.objetivo,
                  Array.isArray(r.ucs) ? r.ucs.join("; ") : (r.ucs ?? ""),
                  "",
                  os.bioma,
                  os.tipoAeronave,
                  os.modeloAeronave,
                  common.prefix,
                  "",
                  "",
                  "",
                ];

          console.log("total colunas:", values.length);
          console.log("valores:", JSON.stringify(values, null, 2));
          console.log("─────────────────────────────────────────────────");

          return addFlightRecord(os.tipo as "Rotativa" | "Fixa", values);
        }),
      );

      return reply.status(201).send({ success: true, count: validRows.length });
    },
  );
}
