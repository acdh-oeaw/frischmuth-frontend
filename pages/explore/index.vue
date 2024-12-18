<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

import type { Quote } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

function getRandomEntries(arr: Array<Quote>, count: number) {
	if (arr.length <= count) return arr;

	const shuffled = arr
		.map((value) => ({ value, sortKey: Math.random() }))
		.sort((a, b) => a.sortKey - b.sortKey)
		.map(({ value }) => value);

	return shuffled.slice(0, count);
}

const { data: quotes } = useQuery({
	queryKey: ["quotes"],
	queryFn() {
		return queryContent<Quote>("pages/quotes").find();
	},
});

const randomQuotes = ref<Array<Quote>>([]);

watchEffect(() => {
	if (quotes.value) {
		randomQuotes.value = getRandomEntries(quotes.value, 3);
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
				to="/explore/places"
				class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
			>
				<span class="uppercase">{{ t("PlacesPage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				to="/explore/journalistic-reception"
				class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
			>
				<span>{{ t("JournalisticReceptionPage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				rel="noopener noreferrer"
				:to="randomQuotes[0]?.link || ''"
				class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
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
				to="/explore/research-aspects"
				class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
			>
				<span class="uppercase">{{ t("ResearchAspectsPage.title") }}</span>
			</NuxtLink>
			<Card class="relative aspect-square overflow-hidden p-4 transition hover:scale-105">
				<NuxtImg
					alt=""
					preload
					src="/assets/images/writing_placeholder.png"
					class="absolute inset-0 size-full object-cover"
				/>
			</Card>
			<NuxtLink
				to="/explore/from-the-archive"
				class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
			>
				<span>{{ t("FromTheArchivePage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				to="/explore/themes"
				class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
			>
				<span class="uppercase">{{ t("ThemesPage.title") }}</span>
			</NuxtLink>
			<Card
				class="relative aspect-square overflow-hidden bg-frisch-indigo p-4 text-white transition hover:scale-105"
			>
				<span class="uppercase">{{ t("AltausseePage.title") }}</span>
			</Card>
			<NuxtLink
				rel="noopener noreferrer"
				:to="randomQuotes[1]?.link || ''"
				class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
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
				to="/explore/academic-reception"
				class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
			>
				<span>{{ t("AcademicReceptionPage.title") }}</span>
			</NuxtLink>

			<NuxtLink
				to="/explore/biography"
				class="relative aspect-square overflow-hidden bg-frisch-indigo p-4 text-white transition hover:scale-105"
			>
				<span class="uppercase">{{ t("BiographyPage.title") }}</span>
			</NuxtLink>
			<NuxtLink
				rel="noopener noreferrer"
				:to="randomQuotes[2]?.link || ''"
				class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
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
				to="/explore/autobiografiction"
				class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
			>
				<span>{{ t("AutobiografictionPage.title") }}</span>
			</NuxtLink>
			<Card class="relative aspect-square overflow-hidden p-4 transition hover:scale-105">
				<NuxtImg
					alt=""
					preload
					src="/assets/images/writing_placeholder.png"
					class="absolute inset-0 size-full object-cover"
				/>
			</Card>
			<NuxtLink
				to="/explore/glossary"
				class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
			>
				<span class="uppercase">{{ t("GlossaryPage.title") }}</span>
			</NuxtLink>
		</div>
	</MainContent>
</template>
