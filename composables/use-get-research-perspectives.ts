import { useQuery } from "@tanstack/vue-query";

import type { ResearchPerspectives } from "@/types/api";

export function useGetPerspectives() {
	const { $api } = useNuxtApp();

	return useQuery({
		queryKey: ["perspectivesList"] as const,
		async queryFn() {
			let allResults: ResearchPerspectives = [];
			let nextUrl: boolean;
			let offset = 0;
			const limit = 500;

			do {
				const response = await $api["apis_api_apis_ontology.researchperspective_list"]({
					queries: { limit, offset },
				});

				allResults = [...allResults, ...response.results];

				if (response.next) {
					const url = new URL(response.next);
					offset = Number(url.searchParams.get("offset")) || offset + limit;
					nextUrl = true;
				} else {
					nextUrl = false;
				}
			} while (nextUrl);

			return { count: allResults.length, results: allResults };
		},
	});
}
