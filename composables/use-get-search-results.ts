import { useQuery } from "@tanstack/vue-query";

import type { SearchFilters } from "@/types/api";

const { $api } = useNuxtApp();

export function useGetSearchResults(params: MaybeRef<SearchFilters>) {
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
