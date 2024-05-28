<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";

defineRouteRules({ prerender: true });

const t = useTranslations();

usePageMetadata({
	title: t("SearchPage.meta.title"),
});

const { $api } = useNuxtApp();
const { data, isFetching } = useQuery({
	queryKey: ["worklist"] as const,
	async queryFn() {
		return $api.api_work_preview_list({
			queries: { limit: 20, offset: 0 },
		});
	},
});
</script>

<template>
	<MainContent class="container py-8">
		<span v-if="isFetching">Loading...</span>
		<DataTable v-if="data != null" :data="data.results"></DataTable>
	</MainContent>
</template>
