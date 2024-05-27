import type { ApiOf, ZodiosResponseByPath } from "@zodios/core";

import type { api } from "@/lib/api";

type api = ApiOf<typeof api>;

export type SearchResults = ZodiosResponseByPath<api, "get", "/api/work-preview/">;
