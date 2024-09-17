import { useQuery } from "@tanstack/vue-query";

export function useGetWork(id: MaybeRef<number>) {
	const { $api } = useNuxtApp();

	return useQuery({
		queryKey: ["entity", id] as const,
		async queryFn({ queryKey }) {
			const [, id] = queryKey;
			const response = await $api.api_work_detail_retrieve({
				params: { id },
			});
			return response;
		},
	});
}
