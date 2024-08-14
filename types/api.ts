import type { ApiOf, ZodiosQueryParamsByPath, ZodiosResponseByPath } from "@zodios/core";
import type { z } from "zod";

import type { api, schemas } from "@/lib/api";

type Api = ApiOf<typeof api>;

export type SearchFilters = ZodiosQueryParamsByPath<Api, "get", "/api/work-preview/">;
export type SearchResults = ZodiosResponseByPath<Api, "get", "/api/work-preview/">;

export type SearchFacets = NonNullable<SearchResults["facets"]>;
export type WorkType = z.infer<typeof schemas.WorkTypeData>;
