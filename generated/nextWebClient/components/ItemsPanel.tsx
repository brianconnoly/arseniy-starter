"use client";

import { useCallback, useEffect, useState } from "react";

/** Соответствует ItemDto / ListItemsResponse в specs/backend/api.tsp */
type ItemDto = { id: string; title: string; createdAt: string };

type ListResponse = {
  items: ItemDto[];
  page: { page: number; pageSize: number; totalCount: number };
};

export function ItemsPanel() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/items?page=1&pageSize=20");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ListResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg =
          typeof body === "object" && body && "message" in body
            ? String((body as { message: unknown }).message)
            : `HTTP ${res.status}`;
        throw new Error(msg);
      }
      setTitle("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка создания");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Элементы</h2>
      <form onSubmit={onCreate}>
        <input
          type="text"
          name="title"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Название элемента"
        />
        <button type="submit" disabled={submitting || !title.trim()}>
          {submitting ? "…" : "Добавить"}
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      {loading ? (
        <p className="lead">Загрузка…</p>
      ) : data ? (
        <>
          <p className="lead">
            Всего: {data.page.totalCount} (стр. {data.page.page}, по{" "}
            {data.page.pageSize})
          </p>
          <ul>
            {data.items.length === 0 ? (
              <li>Пока пусто</li>
            ) : (
              data.items.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span className="meta">
                    {item.id} · {new Date(item.createdAt).toLocaleString("ru")}
                  </span>
                </li>
              ))
            )}
          </ul>
        </>
      ) : null}
    </section>
  );
}
