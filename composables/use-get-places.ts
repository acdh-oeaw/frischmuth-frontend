import { useQuery } from "@tanstack/vue-query";

import type { Places } from "@/types/api";

export function useGetPlaces() {
	const { $api } = useNuxtApp();

	return useQuery({
		queryKey: ["placelist"] as const,
		async queryFn() {
			let allResults: Places = [];
			let nextUrl: boolean;
			let offset = 0;
			const limit = 500;

			do {
				const response = await $api.api_place_preview_list({
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
