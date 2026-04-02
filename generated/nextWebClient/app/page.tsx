import { ItemsPanel } from "@/components/ItemsPanel";

/**
 * Главная страница. Запросы к /api/v1/* проксируются на backend (next.config.mjs → BACKEND_URL).
 * Модель: specs/workspace.c4 — webApp.nextWebClient → webApp.backendApi.
 */
export default function HomePage() {
  return (
    <main>
      <h1>Веб-приложение</h1>
      <p className="lead">
        Клиент Next.js; API по контракту{" "}
        <code>specs/backend/api.tsp</code>.
      </p>
      <ItemsPanel />
    </main>
  );
}
