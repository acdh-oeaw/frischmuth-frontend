import { useQuery } from "@tanstack/vue-query";

import type { ResearchResults } from "@/types/api";

export function useGetPerspectives() {
	const { $api } = useNuxtApp();
	return useQuery({
		queryKey: ["perspectivesList"] as const,
		async queryFn() {
			const response = await $api["apis_api_apis_ontology.researchperspective_list"]({
				queries: {
					limit: 475,
				},
			});

			return response as ResearchResults;
		},
	});
}
