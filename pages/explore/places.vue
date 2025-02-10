<script lang="ts" setup>
import transliterate from "@sindresorhus/transliterate";
import { SearchIcon } from "lucide-vue-next";

import type { StaticPage } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const route = useRoute();

const t = useTranslations();

const { data, isPending } = useGetPlaces();

const places = computed(() => {
	if (!data.value?.results) return [];

	// Step 1: Group places by their first letter
	const grouped = data.value.results
		.map((place) => ({
			...place,
			firstLetter: transliterate(place.name[0].toUpperCase())[0],
		}))
		.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }))
		.reduce((acc, place) => {
			if (!acc[place.firstLetter]) {
				acc[place.firstLetter] = [];
			}
			acc[place.firstLetter].push(place);
			return acc;
		}, {});

	// Step 2: Generate full alphabet array
	const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

	// Step 3: Ensure every letter is present, even if empty
	return alphabet.map((letter) => ({
		letter,
		places: grouped[letter] || [],
	}));
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

watch(
	() => {
		return places.value;
	},
	async () => {
		if (places.value && route.hash != null) {
			await nextTick();
			const el = document.getElementById(route.hash.replace("#", ""));
			if (el) {
				el.scrollIntoView();
			}
		}
	},
);
</script>

<template>
	<MainContent
		class="grid h-full gap-8 overflow-y-auto md:grid-cols-[1fr_3fr] md:justify-center md:px-12 2xl:grid-cols-[2fr_3fr]"
	>
		<div class="flex pt-4 md:justify-end lg:pt-8">
			<Card class="aspect-square size-full bg-frisch-orange md:size-72">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">{{ t("PlacesPage.title") }}</h1>
				</CardContent>
			</Card>
		</div>
		<div>
			<!-- eslint-disable-next-line vue/no-v-html -->
			<section class="prose max-w-3xl pt-4 lg:pt-8" v-html="page?.body" />
			<div v-if="!isLoading">
				<nav
					aria-label="Orte"
					class="sticky top-0 z-10 mt-5 flex w-full max-w-3xl flex-wrap justify-center gap-2 bg-white py-4 transition-all duration-300"
				>
					<a
						v-for="group in places"
						:key="group.letter"
						class="text-lg text-frisch-indigo no-underline hover:underline"
						:href="`#letter-${group.letter}`"
					>
						{{ group.letter }}
					</a>
				</nav>
				<div v-for="group in places" :key="group.letter" class="prose max-w-3xl pt-5">
					<h2
						:id="`letter-${group.letter}`"
						class="mb-3 scroll-mt-20 text-2xl font-bold text-frisch-indigo"
					>
						{{ group.letter }}
					</h2>
					<span v-if="group.places.length === 0" class="text-sm text-muted-foreground">
						Keine Orte vorhanden.
					</span>
					<div v-else class="flex flex-wrap">
						<div v-for="(place, index) in group.places" :key="place.name" class="p-1 text-base">
							<div class="flex gap-2">
								{{ place.name }}
								<NuxtLink
									:href="{
										path: '/search',
										query: { query: place.name },
									}"
								>
									<span class="sr-only">Nach verknüpften Werken suchen</span>
									<SearchIcon class="mt-1 text-frisch-indigo" :size="16" />
								</NuxtLink>
								<span v-if="place.latitude && place.longitude" class="flex items-center">
									<span class="sr-only">Ort anzeigen</span>
									<MapSidebar
										class="cursor-pointer"
										:is-mobile="isMobile"
										:place="place"
										relation="Ort"
									/>
								</span>
								<span v-if="index !== group.places.length - 1">|</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Centered v-else class="pointer-events-none">
				<LoadingSpinner />
			</Centered>
		</div>
	</MainContent>
</template>
