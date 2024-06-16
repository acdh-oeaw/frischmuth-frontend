import type { ApiOf, ZodiosQueryParamsByPath, ZodiosResponseByPath } from "@zodios/core";

import type { api } from "@/lib/api";

type Api = ApiOf<typeof api>;

export type SearchFilters = ZodiosQueryParamsByPath<Api, "get", "/api/work-preview/">;
export type SearchResults = ZodiosResponseByPath<Api, "get", "/api/work-preview/">;
