import { useQuery } from "@tanstack/vue-query";

interface GlossaryEntryParams {
	id: ComputedRef<number | null>;
	isOpen: boolean;
}
export function useGetGlossaryEntry(params: GlossaryEntryParams) {
	const { $api } = useNuxtApp();

	return useQuery({
		queryKey: ["glossary-entry", params.id] as const,
		async queryFn({ queryKey }) {
			const [, id] = queryKey;
			const response = await $api.api_glossar_detail_retrieve({
				params: { id: id ?? 0 },
			});
			return response;
		},
		enabled: computed(() => {
			return params.isOpen || params.id.value != null;
		}),
	});
}
