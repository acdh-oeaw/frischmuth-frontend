<script lang="ts" setup>
import transliterate from "@sindresorhus/transliterate";
import { SearchIcon } from "lucide-vue-next";

import type { Topics } from "@/types/api";
import type { StaticPage } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const route = useRoute();

const t = useTranslations();

usePageMetadata({
	title: t("ThemesPage.meta.title"),
});

const { data, isPending } = useGetTopics();

const topics = computed(() => {
	if (!data.value?.results) return [];

	const grouped = data.value.results
		.filter((topic): topic is { name: string } => Boolean(topic?.name))
		.map((topic) => {
			const firstLetter = topic.name?.charAt(0)?.toUpperCase() ?? "#";
			return { ...topic, firstLetter: transliterate(firstLetter)[0] ?? "#" };
		})
		.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }))
		.reduce<Record<string, Topics>>((acc, topic) => {
			const key = topic.firstLetter || "#";
			if (!acc[key]) acc[key] = [];
			acc[key].push(topic);
			return acc;
		}, {});

	const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

	return alphabet.map((letter) => ({
		letter,
		topics: grouped[letter] || [],
	}));
});

const isLoading = computed(() => {
	return isPending.value;
});

const { data: page } = await useAsyncData("themes-page", async () => {
	return $fetch<StaticPage>("/api/markdown-file", {
		body: JSON.stringify({ path: "pages/themes/themes.md" }),
		method: "POST",
	});
});

const isMobile = computed(() => {
	return window.innerWidth < 1024;
});

watch(
	() => {
		return topics.value;
	},
	async () => {
		if (topics.value && route.hash != null) {
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
		class="grid h-full gap-8 overflow-y-auto px-4 md:grid-cols-[1fr_3fr] md:justify-center md:px-12 2xl:grid-cols-[2fr_3fr]"
	>
		<div class="flex pt-4 md:justify-end lg:pt-8">
			<Card class="aspect-square size-full bg-frisch-orange md:size-72">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">{{ t("ThemesPage.title") }}</h1>
				</CardContent>
			</Card>
		</div>
		<div>
			<!-- eslint-disable-next-line vue/no-v-html -->
			<section class="prose max-w-3xl pt-4 lg:pt-8" v-html="page?.body" />
			<div v-if="!isLoading" class="pb-4 lg:pb-8">
				<nav
					aria-label="Orte"
					class="sticky top-0 z-10 mt-5 flex w-full max-w-3xl flex-wrap justify-center gap-2 bg-white py-4 transition-all duration-300"
				>
					<a
						v-for="group in topics"
						:key="group.letter"
						class="text-lg text-frisch-indigo no-underline hover:underline"
						:href="`#letter-${group.letter}`"
					>
						{{ group.letter }}
					</a>
				</nav>
				<div v-for="group in topics" :key="group.letter" class="prose max-w-3xl pt-5">
					<h2
						:id="`letter-${group.letter}`"
						class="mb-3 scroll-mt-20 text-2xl font-bold text-frisch-indigo"
					>
						{{ group.letter }}
					</h2>
					<span v-if="group.topics.length === 0" class="text-sm text-muted-foreground">
						Keine Themen vorhanden.
					</span>
					<div v-else class="flex flex-wrap">
						<div v-for="(topic, index) in group.topics" :key="topic.name" class="p-1 text-base">
							<div class="flex gap-2">
								{{ topic.name }}
								<NuxtLink
									class="relative"
									:href="{
										path: '/search',
										query: { topic: topic.name },
									}"
								>
									<span class="sr-only">Nach verknüpften Werken suchen</span>
									<SearchIcon class="mt-1 text-frisch-indigo" :size="16" />
								</NuxtLink>
								<span v-if="topic.description" class="relative flex items-center">
									<span class="sr-only">Thema anzeigen</span>
									<DetailSidebar
										class="cursor-pointer"
										:is-mobile="isMobile"
										:source="topic"
										source-type="Thema"
									/>
								</span>
								<span v-if="index !== group.topics.length - 1">|</span>
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
