# Архитектура репозитория

Единый источник правды — модель LikeC4 в [`specs/workspace.c4`](../specs/workspace.c4).

**Программная система `webApp` («Веб-приложение»):** клиент-серверный каркас на React/Next.js.

| Контейнер (id) | Назначение | Технологии |
| --- | --- | --- |
| `webApp.nextWebClient` | UI, SSR, клиентская логика | Next.js, React, TypeScript |
| `webApp.backendApi` | HTTP API и серверная логика | HTTP/JSON, Node.js |
| `webApp.appDatabase` | Персистентные данные | PostgreSQL |

Диаграммы: представления `context` (уровень контекста) и `containers` (уровень контейнеров) в том же файле.

Шаблоны контракта в формате TypeSpec (без установленного компилятора): каталог [`specs/backend/`](../specs/backend/) — [`common.tsp`](../specs/backend/common.tsp) (общие типы), [`api.tsp`](../specs/backend/api.tsp) (HTTP API), [`database.tsp`](../specs/backend/database.tsp) (таблицы PostgreSQL). В LikeC4 на элементах `webApp.backendApi` и `webApp.appDatabase` заданы `link` на эти файлы.