import type { ApiOf, ZodiosQueryParamsByPath, ZodiosResponseByPath } from "@zodios/core";

import type { api } from "@/lib/api";

type Api = ApiOf<typeof api>;

export type SearchFilters = ZodiosQueryParamsByPath<Api, "get", "/api/work-preview/">;
export type SearchResults = ZodiosResponseByPath<Api, "get", "/api/work-preview/">;
export type WorkDetail = ZodiosResponseByPath<Api, "get", "/api/work-detail/:id/">;
export type PlacesFilters = ZodiosQueryParamsByPath<Api, "get", "/apis/api/apis_ontology.place/">;
export type PlacesResults = ZodiosResponseByPath<Api, "get", "/apis/api/apis_ontology.place/">;

export type SearchFacetLanguage = NonNullable<SearchFilters["facet_language"]>;
export type SearchFacetTopic = NonNullable<SearchFilters["facet_topic"]>;
export type SearchFacetWorkType = NonNullable<SearchFilters["facet_work_type"]>;
export type SearchFacetYearEnd = NonNullable<SearchFilters["end_year"]>;
export type SearchFacetYearStart = NonNullable<SearchFilters["start_year"]>;

export type Places = NonNullable<PlacesResults["results"]>;

export type SearchResultFacets = NonNullable<SearchResults["facets"]>;
