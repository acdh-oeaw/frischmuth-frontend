<script lang="ts" setup>
import transliterate from "@sindresorhus/transliterate";
import { EyeIcon } from "lucide-vue-next";

import type { ResearchPerspectives } from "@/types/api";
import type { StaticPage } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();
const route = useRoute();
const router = useRouter();

usePageMetadata({
	title: t("ResearchAspectsPage.meta.title"),
});

const { data, isPending } = useGetPerspectives();
const isOpen = ref(false);

function setPerspectiveQuery(id: number | undefined) {
	if (id != null) {
		void router.push({
			query: { perspective: id },
		});
		isOpen.value = true;
	}
}

const perspectives = computed(() => {
	if (!data.value?.results) return [];

	const grouped = data.value.results
		.filter((perspective): perspective is { name: string } => Boolean(perspective?.name))
		.map((perspective) => {
			const firstLetter = perspective.name?.charAt(0)?.toUpperCase() ?? "#";
			return { ...perspective, firstLetter: transliterate(firstLetter)[0] ?? "#" };
		})
		.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }))
		.reduce<Record<string, ResearchPerspectives>>((acc, perspective) => {
			const key = perspective.firstLetter || "#";
			if (!acc[key]) acc[key] = [];
			acc[key].push(perspective);
			return acc;
		}, {});

	const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

	return alphabet.map((letter) => ({
		letter,
		perspectives: grouped[letter] || [],
	}));
});

const isLoading = computed(() => {
	return isPending.value;
});

const { data: page } = await useAsyncData("research-aspects-page", async () => {
	return $fetch<StaticPage>("/api/markdown-file", {
		body: JSON.stringify({ path: "pages/research-aspects/research-aspects.md" }),
		method: "POST",
	});
});

const isMobile = ref(false);

onMounted(() => {
	isMobile.value = window.innerWidth < 1024;
});

function extractIdFromUrl(url: string) {
	return url.split("/").slice(-2, -1)[0]; // Gets the second last part of the URL
}

watch(
	() => {
		return perspectives.value;
	},
	async () => {
		if (perspectives.value && route.hash != null) {
			await nextTick();
			const el = document.getElementById(route.hash.replace("#", ""));
			if (el) {
				el.scrollIntoView();
			}
		}
	},
);

watch(
	() => {
		return route.query.perspective;
	},
	() => {
		if (route.query.perspective) {
			isOpen.value = true;
		}
	},
	{ immediate: true },
);

function closeSidebar() {
	isOpen.value = false;

	void router.replace({
		query: { ...route.query, perspective: undefined },
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
					<h1 class="uppercase">{{ t("ResearchAspectsPage.title") }}</h1>
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
						v-for="group in perspectives"
						:key="group.letter"
						class="text-lg text-frisch-indigo no-underline hover:underline"
						:href="`#letter-${group.letter}`"
					>
						{{ group.letter }}
					</a>
				</nav>
				<div v-for="group in perspectives" :key="group.letter" class="prose max-w-3xl pt-5">
					<h2
						:id="`letter-${group.letter}`"
						class="mb-3 scroll-mt-20 text-2xl font-bold text-frisch-indigo"
					>
						{{ group.letter }}
					</h2>
					<span v-if="group.perspectives.length === 0" class="text-sm text-muted-foreground">
						Keine Forschungshinsichten vorhanden.
					</span>
					<div v-else class="flex flex-wrap">
						<div
							v-for="(perspective, index) in group.perspectives"
							:key="perspective.name"
							class="p-1 text-base"
						>
							<div class="flex gap-2">
								{{ perspective.name }}
								<!-- Needs review
								 <NuxtLink
									class="relative"
									:href="{
										path: '/search',
										query: { query: perspective.name },
									}"
								>
									<span class="sr-only">Nach verknüpften Werken suchen</span>
									<SearchIcon class="mt-1 text-frisch-indigo" :size="16" />
								</NuxtLink>
								-->
								<span class="sr-only">Forschungsansicht anzeigen</span>
								<Button
									class="px-0 pb-4 text-frisch-orange"
									variant="transparent"
									@click="
										setPerspectiveQuery(
											extractIdFromUrl(perspective.url ?? '') as unknown as number,
										)
									"
								>
									<EyeIcon class="p-0.5" />
								</Button>
								<span v-if="index !== group.perspectives.length - 1">|</span>
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
			<PerspectiveSidebar
				class="absolute"
				:is-mobile="isMobile"
				:is-open="isOpen"
				relation="Forschungshinsicht"
				@close-side-bar="closeSidebar()"
			/>
		</div>
	</MainContent>
</template>
