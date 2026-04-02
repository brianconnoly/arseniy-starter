/**
 * Шаблон описания таблиц PostgreSQL в виде моделей TypeSpec.
 * Соглашение: имена полей — snake_case как в БД; ограничения — в комментариях.
 */
import "./common.tsp";

namespace App.Database;

using App.Common;

/** Таблица `items`. */
model items {
  /** PK, default gen_random_uuid(). */
  id: Uuid;

  title: string;

  /** TIMESTAMPTZ, default now(). */
  created_at: IsoDateTime;
}
