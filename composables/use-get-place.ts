import { useQuery } from "@tanstack/vue-query";

interface PlaceParams {
	id: ComputedRef<number | null>;
	isOpen: boolean;
}
export function useGetPlace(params: PlaceParams) {
	const { $api } = useNuxtApp();

	return useQuery({
		queryKey: ["place", params.id] as const,
		async queryFn({ queryKey }) {
			const [, id] = queryKey;
			const response = await $api.api_place_detail_retrieve({
				params: { id: id ?? 0 },
			});
			return response;
		},
		enabled: computed(() => {
			return params.isOpen || params.id.value != null;
		}),
	});
}
