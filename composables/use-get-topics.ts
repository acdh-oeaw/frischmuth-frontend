import { useQuery } from "@tanstack/vue-query";

import type { TopicsResults } from "@/types/api";

export function useGetTopics() {
	const { $api } = useNuxtApp();
	return useQuery({
		queryKey: ["topicslist"] as const,
		async queryFn() {
			const response = await $api["apis_api_apis_ontology.topic_list"]({
				queries: {
					limit: 475,
				},
			});

			return response as TopicsResults;
		},
	});
}
