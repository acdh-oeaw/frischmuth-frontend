import type { ApiOf, ZodiosQueryParamsByPath, ZodiosResponseByPath } from "@zodios/core";

import type { api } from "@/lib/api";

type Api = ApiOf<typeof api>;

export type SearchFilters = ZodiosQueryParamsByPath<Api, "get", "/api/work-preview/">;
export type SearchResults = ZodiosResponseByPath<Api, "get", "/api/work-preview/">;

export type WorkDetail = ZodiosResponseByPath<Api, "get", "/api/work-detail/:id/">;

export type PlacesFilters = ZodiosQueryParamsByPath<Api, "get", "/apis/api/apis_ontology.place/">;
export type PlacesResults = ZodiosResponseByPath<Api, "get", "/apis/api/apis_ontology.place/">;

export type TopicsFilters = ZodiosQueryParamsByPath<Api, "get", "/apis/api/apis_ontology.topic/">;

export type TopicsResults = ZodiosResponseByPath<Api, "get", "/apis/api/apis_ontology.topic/">;
export type ResearchFilters = ZodiosQueryParamsByPath<
	Api,
	"get",
	"/apis/api/apis_ontology.researchperspective/"
>;

export type ResearchResults = ZodiosResponseByPath<
	Api,
	"get",
	"/apis/api/apis_ontology.researchperspective/"
>;
export type GlossaryFilters = ZodiosQueryParamsByPath<
	Api,
	"get",
	"/apis/api/apis_ontology.glossar/"
>;
export type GlossaryResults = ZodiosResponseByPath<Api, "get", "/apis/api/apis_ontology.glossar/">;
export type CharacterDetail = ZodiosResponseByPath<
	Api,
	"get",
	"/apis/api/apis_ontology.character/:id/"
>;
export type TopicDetail = ZodiosResponseByPath<Api, "get", "/api/topic-detail/:id/">;
export type PlaceDetail = ZodiosResponseByPath<Api, "get", "/api/place-detail/:id/">;
export type ResearchPerspective = ZodiosResponseByPath<
	Api,
	"get",
	"/api/research-perspective-detail/:id/"
>;

export type SearchFacetLanguage = NonNullable<SearchFilters["facet_language"]>;
export type SearchFacetTopic = NonNullable<SearchFilters["facet_topic"]>;
export type SearchFacetWorkType = NonNullable<SearchFilters["facet_work_type"]>;
export type SearchFacetYearEnd = NonNullable<SearchFilters["end_year"]>;
export type SearchFacetYearStart = NonNullable<SearchFilters["start_year"]>;
export type Places = NonNullable<PlacesResults["results"]>;
export type Topics = NonNullable<TopicsResults["results"]>;
export type ResearchPerspectives = NonNullable<ResearchResults["results"]>;
export type GlossaryEntries = NonNullable<GlossaryResults["results"]>;

export type SearchResultFacets = NonNullable<SearchResults["facets"]>;

export type metaCharacter = ZodiosResponseByPath<Api, "get", "/api/metacharacter-detail/:id/">;

export interface CharacterResponse {
	name: string | undefined;
	description: string | undefined;
	fictionality: string | undefined;
	metacharacter: metaCharacter | null;
}
