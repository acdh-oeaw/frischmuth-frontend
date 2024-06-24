import { useQuery } from "@tanstack/vue-query";

import type { SearchFilters } from "@/types/api";

export function useGetSearchResults(params: MaybeRef<SearchFilters>) {
	const { $api } = useNuxtApp();
	return useQuery({
		queryKey: ["worklist", params] as const,
		async queryFn({ queryKey }) {
			const [, params] = queryKey;
			return $api.api_work_preview_list({
				queries: { ...params },
			});
		},
	});
}
