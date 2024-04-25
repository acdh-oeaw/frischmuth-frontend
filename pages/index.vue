<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();
const { $api } = useNuxtApp();

const { data, isFetching } = useQuery({
	queryKey: ["worklist"] as const,
	queryFn: async () => {
		const response = await $api.api_work_preview_list({
			queries: {
				limit: 10,
				offset: 0,
			},
		});
		return response;
	},
});

usePageMetadata({
	title: t("IndexPage.meta.title"),
});
</script>

<template>
	<MainContent class="container py-8">
		<h1>{{ t("IndexPage.title") }}</h1>
		<span v-if="isFetching">Loading...</span>
		<span v-else>
			{{ data }}
		</span>
	</MainContent>
</template>
