<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

import type { ExploreImages, Quote } from "@/types/content";

defineRouteRules({
	prerender: true,
});

interface Image {
	title: string;
	image: string;
	alt?: string;
	copyright?: string;
}

const t = useTranslations();

function getRandomEntries(arr: Array<Quote>, count: number) {
	if (arr.length <= count) return arr;

	const shuffled = arr
		.map((value) => ({ value, sortKey: Math.random() }))
		.sort((a, b) => a.sortKey - b.sortKey)
		.map(({ value }) => value);

	return shuffled.slice(0, count);
}

function getRandomImages(arr: ExploreImages, count: number): Array<Image> {
	if (arr.images.length <= count) return arr.images;

	const shuffled = arr.images
		.map((value) => ({ value, sortKey: Math.random() }))
		.sort((a, b) => a.sortKey - b.sortKey)
		.map(({ value }) => value);

	return shuffled.slice(0, count) as Array<Image>;
}

const { data: quotes } = useQuery({
	queryKey: ["quotes"],
	queryFn() {
		return queryContent<Quote>("pages/quotes").find();
	},
});

const { data: exploreImages } = useQuery({
	queryKey: ["exploreImages"],
	queryFn() {
		return queryContent<ExploreImages>("pages/explore-images/explore-images").findOne();
	},
});

const randomQuotes = ref<Array<Quote>>([]);
const randomImages = ref<Array<Image> | null>(null);

watchEffect(() => {
	if (quotes.value) {
		randomQuotes.value = getRandomEntries(quotes.value, 3);
	}
});

watchEffect(() => {
	if (exploreImages.value) {
		randomImages.value = getRandomImages(exploreImages.value, 2);
	}
});

usePageMetadata({
	title: t("ExplorePage.meta.title"),
});
</script>

<template>
	<MainContent class="container grid content-center items-center p-4 lg:py-8">
		<h1 class="sr-only">{{ t("ExplorePage.title") }}</h1>
		<div
			class="grid max-h-full grid-cols-2 gap-2 font-bold lg:gap-4 lg:text-2xl lg:grid-fluid-cols-72"
		>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				to="/explore/places"
			>
				<span class="uppercase">{{ t("PlacesPage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				to="/explore/journalistic-reception"
			>
				<span>{{ t("JournalisticReceptionPage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
				rel="noopener noreferrer"
				:to="randomQuotes[0]?.link || ''"
			>
				<span class="sr-only">
					{{ randomQuotes[0]?.text || "Loading content..." }}
				</span>

				<template v-if="randomQuotes[0] != null">
					<ContentRenderer class="text-frisch-orange" :value="randomQuotes[0]" />
				</template>
				<template v-else>
					<span class="flex size-full items-center justify-center text-sm text-frisch-orange">
						<LoadingSpinner />
					</span>
				</template>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				to="/explore/research-aspects"
			>
				<span class="uppercase">{{ t("ResearchAspectsPage.title") }}</span>
			</NuxtLink>
			<Card class="relative aspect-square overflow-hidden p-4 transition hover:scale-105">
				<template v-if="randomImages != null && randomImages.length > 0">
					<NuxtImg
						:alt="randomImages[0]?.alt || randomImages[0]?.title || ''"
						class="absolute inset-0 size-full object-cover"
						preload
						:src="randomImages ? randomImages[0]?.image : '/assets/images/writing_placeholder.png'"
					/>
				</template>
				<template v-else>
					<span class="flex size-full items-center justify-center text-sm text-frisch-orange">
						<LoadingSpinner />
					</span>
				</template>
			</Card>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				to="/explore/from-the-archive"
			>
				<span>{{ t("FromTheArchivePage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				to="/explore/themes"
			>
				<span class="uppercase">{{ t("ThemesPage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-indigo p-4 text-white transition hover:scale-105"
				to="/explore/altaussee"
			>
				<span class="uppercase">{{ t("AltausseePage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
				rel="noopener noreferrer"
				:to="randomQuotes[1]?.link || ''"
			>
				<span class="sr-only">
					{{ randomQuotes[1]?.text || "Loading content..." }}
				</span>

				<template v-if="randomQuotes[1] != null">
					<ContentRenderer class="text-frisch-orange" :value="randomQuotes[1]" />
				</template>
				<template v-else>
					<span class="flex size-full items-center justify-center text-sm text-frisch-orange">
						<LoadingSpinner />
					</span>
				</template>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				to="/explore/academic-reception"
			>
				<span>{{ t("AcademicReceptionPage.title") }}</span>
			</NuxtLink>

			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-indigo p-4 text-white transition hover:scale-105"
				to="/explore/biography"
			>
				<span class="uppercase">{{ t("BiographyPage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
				rel="noopener noreferrer"
				:to="randomQuotes[2]?.link || ''"
			>
				<span class="sr-only">
					{{ randomQuotes[2]?.text || "Loading content..." }}
				</span>

				<template v-if="randomQuotes[2] != null">
					<ContentRenderer class="text-frisch-orange" :value="randomQuotes[2]" />
				</template>
				<template v-else>
					<span class="flex size-full items-center justify-center text-sm text-frisch-orange">
						<LoadingSpinner />
					</span>
				</template>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				to="/explore/autobiografiction"
			>
				<span>{{ t("AutobiografictionPage.title") }}</span>
			</NuxtLink>
			<Card class="relative aspect-square overflow-hidden p-4 transition hover:scale-105">
				<template v-if="randomImages != null && randomImages.length > 1">
					<NuxtImg
						:alt="randomImages[1]?.alt || randomImages[1]?.title || ''"
						class="absolute inset-0 size-full object-cover"
						preload
						:src="randomImages ? randomImages[1]?.image : '/assets/images/writing_placeholder.png'"
					/>
				</template>
				<template v-else>
					<span class="flex size-full items-center justify-center text-sm text-frisch-orange">
						<LoadingSpinner />
					</span>
				</template>
			</Card>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				to="/explore/glossary"
			>
				<span class="uppercase">{{ t("GlossaryPage.title") }}</span>
			</NuxtLink>
		</div>
	</MainContent>
</template>
