import { useQuery } from "@tanstack/vue-query";

import type { GlossaryEntries } from "@/types/api";

export function useGetGlossary() {
	const { $api } = useNuxtApp();

	return useQuery({
		queryKey: ["glossaryList"] as const,
		async queryFn() {
			let allResults: GlossaryEntries = [];
			let nextUrl: boolean;
			let offset = 0;
			const limit = 500;

			do {
				const response = await $api["apis_api_apis_ontology.glossar_list"]({
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
