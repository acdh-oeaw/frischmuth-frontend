import { useQuery } from "@tanstack/vue-query";

interface TopicParams {
	id: ComputedRef<number | null>;
	isOpen: boolean;
}
export function useGetTopic(params: TopicParams) {
	const { $api } = useNuxtApp();

	return useQuery({
		queryKey: ["topic", params.id] as const,
		async queryFn({ queryKey }) {
			const [, id] = queryKey;
			const response = await $api.api_topic_detail_retrieve({
				params: { id: id ?? 0 },
			});
			return response;
		},
		enabled: computed(() => {
			return params.isOpen || params.id.value != null;
		}),
	});
}
