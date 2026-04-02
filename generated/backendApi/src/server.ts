/**
 * Backend API — реализация контракта в specs/backend/api.tsp, модель в specs/workspace.c4 (webApp.backendApi).
 * Схема БД: specs/backend/database.tsp
 */
import cors from "@fastify/cors";
import Fastify from "fastify";
import pg from "pg";

const { Pool } = pg;

const PORT = Number(process.env.PORT) || 4001;
const DATABASE_URL = process.env.DATABASE_URL;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:4000";

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function ensureSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

const app = Fastify({ logger: true });

await app.register(cors, { origin: CORS_ORIGIN });

app.get("/api/v1/health", async () => ({ status: "ok" as const }));

app.get<{
  Querystring: { page?: string; pageSize?: string };
}>("/api/v1/items", async (request, reply) => {
  const page = Math.max(1, parseInt(request.query.page ?? "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(request.query.pageSize ?? "10", 10) || 10),
  );
  const offset = (page - 1) * pageSize;

  const countResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM items",
  );
  const totalCount = parseInt(countResult.rows[0]?.count ?? "0", 10);

  const listResult = await pool.query<{
    id: string;
    title: string;
    created_at: Date;
  }>(
    `SELECT id, title, created_at FROM items
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [pageSize, offset],
  );

  const items = listResult.rows.map((row) => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at.toISOString(),
  }));

  return {
    items,
    page: { page, pageSize, totalCount },
  };
});

app.get<{ Params: { id: string } }>("/api/v1/items/:id", async (request, reply) => {
  const { id } = request.params;
  const result = await pool.query<{
    id: string;
    title: string;
    created_at: Date;
  }>("SELECT id, title, created_at FROM items WHERE id = $1", [id]);

  if (result.rowCount === 0) {
    return reply.status(404).send({
      code: "NOT_FOUND",
      message: "Item not found",
    });
  }

  const row = result.rows[0]!;
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at.toISOString(),
  };
});

app.post<{ Body: { title?: string } }>("/api/v1/items", async (request, reply) => {
  const title = request.body?.title?.trim();
  if (!title) {
    return reply.status(400).send({
      code: "VALIDATION_ERROR",
      message: "title is required",
    });
  }

  const result = await pool.query<{
    id: string;
    title: string;
    created_at: Date;
  }>(
    "INSERT INTO items (title) VALUES ($1) RETURNING id, title, created_at",
    [title],
  );

  const row = result.rows[0]!;
  return reply.status(201).send({
    id: row.id,
    title: row.title,
    createdAt: row.created_at.toISOString(),
  });
});

try {
  await ensureSchema();
  await app.listen({ port: PORT, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
