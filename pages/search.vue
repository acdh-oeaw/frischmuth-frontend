<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";

defineRouteRules({ prerender: true });
const { $api } = useNuxtApp();
const { data, isFetching } = useQuery({
	queryKey: ["worklist"] as const,
	queryFn: async () => {
		const response = await $api.api_work_preview_list({
			queries: { limit: 10, offset: 0 },
		});
		return response;
	},
});
</script>

<template>
	<MainContent class="container py-8">
		<span v-if="isFetching">Loading...</span>
		<span v-else>
			{{ data }}
		</span>
	</MainContent>
</template>
