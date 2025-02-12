import { useQuery } from "@tanstack/vue-query";

import type { GlossaryResults } from "@/types/api";

export function useGetGlossary() {
	const { $api } = useNuxtApp();
	return useQuery({
		queryKey: ["glossarylist"] as const,
		async queryFn() {
			const response = await $api["apis_api_apis_ontology.glossar_list"]({
				queries: {
					limit: 500,
				},
			});

			return response as GlossaryResults;
		},
	});
}
