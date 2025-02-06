import { useQuery } from "@tanstack/vue-query";

import type { PlacesResults } from "@/types/api";

export function useGetPlaces() {
	const { $api } = useNuxtApp();
	return useQuery({
		queryKey: ["placelist"] as const,
		async queryFn() {
			const response = await $api["apis_api_apis_ontology.place_list"]({
				queries: {
					limit: 475,
				},
			});

			return response as PlacesResults;
		},
	});
}
