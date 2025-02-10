<script lang="ts" setup>
import transliterate from "@sindresorhus/transliterate";
import type { StaticPage } from "@/types/content";
import { SearchIcon } from "lucide-vue-next";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

const { data, isPending } = useGetPlaces();

const places = computed(() => {
	const grouped = data.value?.results
		.map((place) => ({
			...place,
			firstLetter: transliterate(place.name[0].toUpperCase())[0],
		}))
		.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }));

	const result = grouped.reduce((acc, place) => {
		const firstLetter = place.firstLetter;
		if (!acc[firstLetter]) {
			acc[firstLetter] = [];
		}
		acc[firstLetter].push(place);
		return acc;
	}, {});

	console.log(result);

	const sortedGroupedPlaces = Object.keys(result)
		.sort()
		.map((letter) => result[letter]);

	return sortedGroupedPlaces;
});

const isLoading = computed(() => {
	return isPending.value;
});

usePageMetadata({
	title: t("PlacesPage.meta.title"),
});

const { data: page } = await useAsyncData("places-page", async () => {
	return $fetch<StaticPage>("/api/markdown-file", {
		body: JSON.stringify({ path: "pages/places/places.md" }),
		method: "POST",
	});
});

const isMobile = computed(() => {
	return window.innerWidth < 1024;
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

		<!-- eslint-disable-next-line vue/no-v-html -->
		<section class="prose max-w-3xl" v-html="page?.body" />
	</MainContent>
</template>
