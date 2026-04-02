/**
 * Шаблон описания HTTP API (контракт в стиле TypeSpec).
 */
import "./common.tsp";

namespace App.Api;

using App.Common;

/** Пример DTO элемента в ответах API. */
model ItemDto {
  id: Uuid;
  title: string;
  createdAt: IsoDateTime;
}

/** Тело ответа GET …/items с пагинацией. */
model ListItemsResponse {
  items: ItemDto[];
  page: PageInfo;
}

/**
 * Намерения операций (без @typespec/http). Ошибки — см. App.Common.ErrorBody.
 * При подключении компилятора добавьте маршруты и коды ответов декораторами.
 */
interface ItemsOperations {
  /** GET /api/v1/items?page=&pageSize= */
  listItems(query: PageQuery): ListItemsResponse;

  /** GET /api/v1/items/{id} */
  getItem(id: Uuid): ItemDto;

  /** POST /api/v1/items */
  createItem(body: { title: string }): ItemDto;
}

/** Служебная проверка: GET /api/v1/health */
model HealthResponse {
  status: "ok";
}
