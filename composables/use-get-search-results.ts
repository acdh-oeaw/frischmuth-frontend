import { useQuery } from "@tanstack/vue-query";

const { $api } = useNuxtApp();

export interface SearchFilters {
	limit: number;
	offset: number;
}

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
