<script lang="ts" setup>
import type { ExploreImages, Quote } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("ExplorePage.meta.title"),
});

interface Image {
	title: string;
	image: string;
	alt?: string;
	copyright?: string;
}

function getRandomEntries(arr: Array<Quote>, count: number) {
	if (arr.length <= count) return arr;

	const shuffled = arr
		.map((value) => ({ value, sortKey: Math.random() }))
		.sort((a, b) => a.sortKey - b.sortKey)
		.map(({ value }) => value);

	return shuffled.slice(0, count);
}

function getRandomImages(arr: ExploreImages, count: number): Array<Image> {
	if (arr.metadata.images.length <= count) return arr.metadata.images;

	const shuffled = arr.metadata.images
		.map((value) => ({ value, sortKey: Math.random() }))
		.sort((a, b) => a.sortKey - b.sortKey)
		.map(({ value }) => value);

	return shuffled.slice(0, count) as Array<Image>;
}

const { data: page } = await useAsyncData("explore-page", async () => {
	const exploreImages = await $fetch<ExploreImages>("/api/markdown-file", {
		body: JSON.stringify({ path: "pages/explore-images/explore-images.md" }),
		method: "POST",
	});

	const quotes = await $fetch<Array<Quote>>("/api/markdown-folder", {
		body: JSON.stringify({ path: "pages/quotes" }),
		method: "POST",
	});

	return { exploreImages, quotes };
});

const randomQuotes = computed(() => {
	if (!page.value?.quotes) return [];
	return getRandomEntries(page.value.quotes, 3);
});

const randomImages = computed(() => {
	if (!page.value?.exploreImages) return [];
	return getRandomImages(page.value.exploreImages, 2);
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
				:to="randomQuotes[0]?.metadata.link || ''"
			>
				<span class="sr-only">
					{{ randomQuotes[0]?.metadata.title || "Loading content..." }}
				</span>

				<template v-if="randomQuotes[0] != null">
					<!-- eslint-disable-next-line vue/no-v-html -->
					<div class="text-frisch-orange" v-html="randomQuotes[0].body" />
				</template>
				<template v-else>
					<span class="flex size-full items-center justify-center text-sm text-frisch-orange">
						<LoadingSpinner />
					</span>
				</template>
			</NuxtLink>
			<NuxtLink
				class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				to="/explore/research-perspectives"
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
				:to="randomQuotes[1]?.metadata.link || ''"
			>
				<span class="sr-only">
					{{ randomQuotes[1]?.metadata.title || "Loading content..." }}
				</span>

				<template v-if="randomQuotes[1] != null">
					<!-- eslint-disable-next-line vue/no-v-html -->
					<div class="text-frisch-orange" v-html="randomQuotes[1].body" />
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
				:to="randomQuotes[2]?.metadata.link || ''"
			>
				<span class="sr-only">
					{{ randomQuotes[2]?.metadata.title || "Loading content..." }}
				</span>

				<template v-if="randomQuotes[2] != null">
					<!-- eslint-disable-next-line vue/no-v-html -->
					<div class="text-frisch-orange" v-html="randomQuotes[2].body" />
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
