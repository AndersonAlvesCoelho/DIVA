import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import "dotenv/config";
import Fastify from "fastify";

import { osRoutes } from "./routes/os";
import { recordsRoutes } from "./routes/records";
import { ucsRoutes } from "./routes/ucs";

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "warn" : "info",
    transport:
      process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  },
});

async function bootstrap() {
  // CORS
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL ?? "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  // Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "AeroHoras API",
        description: "API de controle de horas de voo — DIVA / ICMBio",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list" },
  });

  // Rotas
  await fastify.register(osRoutes, { prefix: "/os" });
  await fastify.register(recordsRoutes, { prefix: "/records" });
  await fastify.register(ucsRoutes, { prefix: "/ucs" });

  fastify.get<{ Params: { tabela: string } }>(
    "/debug/tabelas/:tabela",
    async (request, reply) => {
      const { getAppToken } = await import("./services/authService");
      const token = await getAppToken();
      const axios = (await import("axios")).default;
      const headers = { Authorization: `Bearer ${token}` };

      const { tabela } = request.params;
      const base = `https://graph.microsoft.com/v1.0/drives/${process.env.SP_DRIVE_ID_CTRL}/items/${process.env.SP_ITEM_ID_CTRL}/workbook/tables/${tabela}`;

      try {
        const [headersRes, rowsRes] = await Promise.all([
          axios.get(`${base}/headerRowRange`, { headers }),
          axios.get(`${base}/rows`, { headers }),
        ]);

        const colunas: string[] = headersRes.data.values?.[0] ?? [];
        const rows = rowsRes.data.value ?? [];

        // Converte as primeiras 3 linhas em objetos com nome de coluna
        const dados = rows
          .slice(0, 3)
          .map((row: any) =>
            Object.fromEntries(
              colunas.map((col, i) => [col, row.values[0][i]]),
            ),
          );

        return reply.send({ tabela, colunas, dados });
      } catch (err: any) {
        return reply.send({ erro: err.response?.data ?? err.message });
      }
    },
  );

  // Health check
  fastify.get("/health", { schema: { tags: ["Health"] } }, async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

  // Start
  const port = Number(process.env.PORT ?? 3000);
  await fastify.listen({ port, host: "0.0.0.0" });
  fastify.log.info(`Docs disponíveis em http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
