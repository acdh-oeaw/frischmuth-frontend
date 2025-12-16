<script lang="ts" setup>
import transliterate from "@sindresorhus/transliterate";
import { EyeIcon } from "lucide-vue-next";

import type { GlossaryEntries } from "@/types/api";
import type { StaticPage } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const route = useRoute();
const router = useRouter();
const t = useTranslations();

usePageMetadata({
	title: t("GlossaryPage.meta.title"),
});

const isOpen = ref(false);

const { data, isPending } = useGetGlossary();

function extractIdFromUrl(url: string) {
	return url.split("/").slice(-2, -1)[0]; // Gets the second last part of the URL
}

const glossary = computed(() => {
	if (!data.value?.results) return [];

	const grouped = data.value.results
		.filter((entry): entry is { name: string } => Boolean(entry?.name))
		.map((entry) => {
			const firstLetter = entry.name?.charAt(0)?.toUpperCase() ?? "#";
			return { ...entry, firstLetter: transliterate(firstLetter)[0] ?? "#" };
		})
		.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }))
		.reduce<Record<string, GlossaryEntries>>((acc, entry) => {
			const key = entry.firstLetter || "#";
			if (!acc[key]) acc[key] = [];
			acc[key].push(entry);
			return acc;
		}, {});

	const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

	return alphabet.map((letter) => ({
		letter,
		entries: grouped[letter] || [],
	}));
});

const isLoading = computed(() => {
	return isPending.value;
});

const { data: page } = await useAsyncData("glossary-page", async () => {
	return $fetch<StaticPage>("/api/markdown-file", {
		body: JSON.stringify({ path: "pages/glossary/glossary.md" }),
		method: "POST",
	});
});

const isMobile = ref(false);

onMounted(() => {
	isMobile.value = window.innerWidth < 1024;
	if (route.query.entry) setGlossaryQuery(Number(route.query.entry));
});

watch(
	() => {
		return glossary.value;
	},
	async () => {
		if (glossary.value && route.hash != null) {
			await nextTick();
			const el = document.getElementById(route.hash.replace("#", ""));
			if (el) {
				el.scrollIntoView();
			}
		}
	},
);

function setGlossaryQuery(id: number | undefined) {
	if (id != null) {
		void router.push({
			query: { entry: id },
		});
		isOpen.value = true;
	}
}

function closeSidebar() {
	isOpen.value = false;

	void router.replace({
		query: { ...route.query, entry: undefined },
	});
}
</script>

<template>
	<MainContent
		class="grid h-full gap-8 overflow-y-auto px-4 md:grid-cols-[1fr_3fr] md:justify-center md:px-12 2xl:grid-cols-[2fr_3fr]"
	>
		<div class="flex pt-4 md:justify-end lg:pt-8">
			<Card class="aspect-square size-full bg-frisch-orange md:size-72">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">{{ t("GlossaryPage.title") }}</h1>
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
						v-for="group in glossary"
						:key="group.letter"
						class="text-lg text-frisch-indigo no-underline hover:underline"
						:href="`#letter-${group.letter}`"
					>
						{{ group.letter }}
					</a>
				</nav>
				<div v-for="group in glossary" :key="group.letter" class="prose max-w-3xl pt-5">
					<h2
						:id="`letter-${group.letter}`"
						class="mb-3 scroll-mt-20 text-2xl font-bold text-frisch-indigo"
					>
						{{ group.letter }}
					</h2>
					<span v-if="group.entries.length === 0" class="text-sm text-muted-foreground">
						Keine Glossareinträge vorhanden.
					</span>
					<div v-else class="flex flex-wrap">
						<div v-for="(entry, index) in group.entries" :key="entry.name" class="p-1 text-base">
							<div class="flex gap-2">
								{{ entry.name }}
								<span class="sr-only">Ort anzeigen</span>
								<Button
									class="px-0 pb-4 text-frisch-orange"
									variant="transparent"
									@click="setGlossaryQuery(extractIdFromUrl(entry.url ?? '') as unknown as number)"
								>
									<EyeIcon class="p-0.5" />
								</Button>
								<span v-if="index !== group.entries.length - 1">|</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Centered v-else class="pointer-events-none">
				<LoadingSpinner />
			</Centered>
		</div>
		<div v-show="isOpen">
			<GlossarySidebar
				class="absolute"
				:is-mobile="isMobile"
				:is-open="isOpen"
				relation="Glossareintrag"
				@close-side-bar="closeSidebar()"
			/>
		</div>
	</MainContent>
</template>
