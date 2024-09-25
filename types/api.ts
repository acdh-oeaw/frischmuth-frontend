import type { ApiOf, ZodiosQueryParamsByPath, ZodiosResponseByPath } from "@zodios/core";
import type { z } from "zod";

import type { api, schemas } from "@/lib/api";

type Api = ApiOf<typeof api>;

export type SearchFilters = ZodiosQueryParamsByPath<Api, "get", "/api/work-preview/">;
export type SearchResults = ZodiosResponseByPath<Api, "get", "/api/work-preview/">;
export type WorkDetail = ZodiosResponseByPath<Api, "get", "/api/work-detail/:id/">;

export type SearchFacetLanguage = NonNullable<SearchFilters["facet_language"]>;
export type SearchFacetTopic = NonNullable<SearchFilters["facet_topic"]>;

export type SearchResultFacets = NonNullable<SearchResults["facets"]>;
export type WorkType = z.infer<typeof schemas.WorkTypeData>;
