<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("PlacesPage"),
});

const { data: places, error: aboutError } = useQuery({
	queryKey: ["places"] as const,
	queryFn() {
		return queryContent("pages/places/places").findOne();
	},
});

useErrorMessage(aboutError, {
	notFound: t("PlacesPage.errors.404"),
	unknown: t("PlacesPage.errors.500"),
});
</script>

<template>
	<MainContent
		class="grid gap-8 p-4 md:grid-cols-[1fr_3fr] md:justify-center md:px-12 lg:py-8 2xl:grid-cols-[2fr_3fr]"
	>
		<div class="flex md:justify-end">
			<Card class="aspect-square size-full bg-frisch-orange md:size-72">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">{{ t("PlacesPage.title") }}</h1>
				</CardContent>
			</Card>
		</div>

		<ContentRenderer v-if="places" class="prose max-w-3xl" :value="places">
			<template #empty></template>
		</ContentRenderer>
	</MainContent>
</template>
