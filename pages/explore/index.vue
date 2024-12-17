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

const {
	data: quotes,
	isLoading: isLoading,
	error: quotesError,
} = useQuery({
	queryKey: ["quotes"],
	queryFn() {
		return queryContent<Quote>("pages/quotes").find();
	},
});

const randomQuotes = ref<Quote[]>([]);

watchEffect(() => {
	if (quotes.value) {
		randomQuotes.value = getRandomEntries(quotes.value, 3);
	}
});

const quotesReady = computed(() => randomQuotes.value.length > 0);

usePageMetadata({
	title: t("ExplorePage.meta.title"),
});
</script>

<template>
	<MainContent class="container p-4 lg:py-8">
		<h1 class="sr-only">{{ t("ExplorePage.title") }}</h1>
		<div class="mx-auto flex size-full max-h-full items-center justify-center font-semibold">
			<div
				class="mx-auto grid max-h-full grid-cols-2 gap-2 font-bold lg:gap-4 lg:text-2xl lg:grid-fluid-cols-72"
			>
				<NuxtLink
					to="/explore/places"
					class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				>
					<span>ORTE</span>
				</NuxtLink>
				<NuxtLink
					to="/explore/journalistic-reception"
					class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				>
					<span>Journalistische Rezeption</span>
				</NuxtLink>
				<NuxtLink
					:to="randomQuotes[0]?.link || ''"
					class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
				>
					<template v-if="randomQuotes[0] != null">
						<ContentRenderer :value="randomQuotes[0]" />
					</template>
					<template v-else>
						<span class="flex h-full w-full items-center justify-center text-sm text-frisch-orange">
							<LoadingSpinner />
						</span>
					</template>
				</NuxtLink>
				<NuxtLink
					to="/explore/research-aspects"
					class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				>
					<span>FORSCHUNGS-HINSICHTEN</span>
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
					<span>Aus dem Archiv</span>
				</NuxtLink>
				<NuxtLink
					to="/explore/themes"
					class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				>
					<span>THEMEN</span>
				</NuxtLink>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-indigo p-4 text-white transition hover:scale-105"
				>
					<span class="relative">ALTAUSSEE</span>
				</Card>
				<NuxtLink
					:to="randomQuotes[1]?.link || ''"
					class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
				>
					<template v-if="randomQuotes[1] != null">
						<ContentRenderer :value="randomQuotes[1]" />
					</template>
					<template v-else>
						<span class="flex h-full w-full items-center justify-center text-frisch-orange">
							<LoadingSpinner />
						</span>
					</template>
				</NuxtLink>
				<NuxtLink
					to="/explore/glossary"
					class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				>
					<span>GLOSSAR</span>
				</NuxtLink>
				<NuxtLink
					to="/explore/biography"
					class="relative aspect-square overflow-hidden bg-frisch-indigo p-4 text-white transition hover:scale-105"
				>
					<span>BIOGRAFIE</span>
				</NuxtLink>
				<NuxtLink
					:to="randomQuotes[2]?.link || ''"
					class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
				>
					<template v-if="randomQuotes[2] != null">
						<ContentRenderer :value="randomQuotes[2]" />
					</template>
					<template v-else>
						<span class="flex h-full w-full items-center justify-center text-sm text-frisch-orange">
							<LoadingSpinner />
						</span>
					</template>
				</NuxtLink>
				<NuxtLink
					to="/explore/autobiografiction"
					class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				>
					<span>Autobiografiktion</span>
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
					to="/explore/academic-reception"
					class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				>
					<span>Akademische Rezeption</span>
				</NuxtLink>
			</div>
		</div>
	</MainContent>
</template>
