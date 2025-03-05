import { useQuery } from "@tanstack/vue-query";

interface ResearchPerspectiveParams {
	id: ComputedRef<number | null>;
	isOpen: boolean;
}
export function useGetPerspective(params: ResearchPerspectiveParams) {
	const { $api } = useNuxtApp();

	return useQuery({
		queryKey: ["perspective", params.id] as const,
		async queryFn({ queryKey }) {
			const [, id] = queryKey;
			const response = await $api.api_research_perspective_detail_retrieve({
				params: { id: id ?? 0 },
			});
			return response;
		},
		enabled: computed(() => {
			return params.isOpen || params.id.value != null;
		}),
	});
}
