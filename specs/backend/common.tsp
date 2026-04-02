/**
 * Общие типы для контракта HTTP API и для описания сущностей БД.
 * Файлы вручную, без подключённого компилятора TypeSpec.
 */
namespace App.Common;

/** Идентификатор записи (UUID v4 в строке). */
scalar Uuid extends string;

/** Дата-время в ISO-8601 UTC. */
scalar IsoDateTime extends string;

/** Унифицированное тело ошибки API. */
model ErrorBody {
  code: string;
  message: string;
  /** Опциональные детали для отладки (не для публичных клиентов). */
  traceId?: string;
}

/** Query-параметры постраничного списка. */
model PageQuery {
  /** Номер страницы, начиная с 1. */
  page: int32;

  /** Число элементов на странице. */
  pageSize: int32;
}

/** Метаданные постраничности в теле ответа. */
model PageInfo {
  page: int32;
  pageSize: int32;
  totalCount: int32;
}
