<script lang="ts" setup>
import transliterate from "@sindresorhus/transliterate";
import { useQuery } from "@tanstack/vue-query";
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
	title: t("PlacesPage"),
});

const { data: placesIntro, error: aboutError } = useQuery({
	queryKey: ["placesIntro"] as const,
	queryFn() {
		return queryContent("pages/places/places").findOne();
	},
});

useErrorMessage(aboutError, {
	notFound: t("PlacesPage.errors.404"),
	unknown: t("PlacesPage.errors.500"),
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

		<div>
			<ContentRenderer v-if="placesIntro" class="prose max-w-3xl" :value="placesIntro">
				<template #empty></template>
			</ContentRenderer>
			<div v-if="!isLoading">
				<nav
					class="prose flex w-full max-w-3xl justify-center pt-4 text-frisch-indigo"
					aria-label="Orte"
				>
					<a href="#10">WIP Navigation</a>
				</nav>
				<div v-for="(letterGroup, index) in places" :key="index" class="prose max-w-3xl pt-5">
					<!-- Group of places by letter -->
					<h2 :id="String(index)" class="mb-3 text-2xl font-bold text-frisch-indigo">
						{{ String.fromCharCode(65 + index) }}
					</h2>
					<div v-if="letterGroup.length === 0" class="p-3 text-sm text-muted-foreground">
						Keine Orte vorhanden.
					</div>
					<div v-else class="flex flex-wrap">
						<div v-for="(place, letter) in letterGroup" :key="place.name" class="p-1 text-base">
							<div class="flex gap-2">
								{{ place.name }}
								<NuxtLink
									:href="{
										path: '/search',
										query: {
											query: place.name,
										},
									}"
								>
									<span class="sr-only">Nach verknüpften Werken suchen</span>
									<SearchIcon :size="16" class="mt-1 text-frisch-indigo" />
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

								<span v-if="letter !== letterGroup.length - 1">|</span>
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
