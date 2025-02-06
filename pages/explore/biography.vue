<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

import type { BiographyEntry } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("BiographyPage.meta.title"),
});

const { data: biography, error } = useQuery({
	queryKey: ["biography"] as const,
	queryFn() {
		return queryContent<BiographyEntry>("pages/biography").find();
	},
});

useErrorMessage(error, {
	notFound: t("BiographyPage.errors.404"),
	unknown: t("BiographyPage.errors.500"),
});

const sortedEntries = computed(() => {
	if (biography.value == null) return null;

	const sorted = biography.value.slice().sort((a, b) => {
		return Number(a.year) - Number(b.year);
	});

	return sorted.slice(0, 10);
});
</script>

<template>
	<MainContent
		class="grid gap-8 p-4 md:grid-cols-[1fr_3fr] md:justify-center md:px-12 lg:py-8 2xl:grid-cols-[2fr_3fr]"
	>
		<div class="flex md:justify-end">
			<Card class="aspect-square size-full bg-frisch-indigo md:size-72">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">Biografie</h1>
				</CardContent>
			</Card>
		</div>

		<div v-if="biography" class="relative w-full max-w-5xl">
			<div>
				<div v-for="(entry, index) in sortedEntries" :key="index" class="pb-4">
					<div class="grid w-full grid-cols-[1fr_auto_1fr] items-start justify-end gap-4 pb-2">
						<div v-if="entry.image" class="grid grid-cols-[auto_1fr] items-end gap-4">
							<div v-if="entry.imageTitle || entry.copyright" class="prose m-0 text-sm">
								<div v-if="entry.imageTitle" class="font-semibold text-frisch-indigo">
									{{ entry.imageTitle }}
								</div>
								<div v-if="entry.copyright">© {{ entry.copyright }}</div>
							</div>
							<div v-else></div>
							<div class="relative block size-full self-end object-contain align-top">
								<NuxtImg
									:alt="entry.imageTitle ?? ''"
									class="size-full object-contain"
									preload
									:src="entry.image"
								/>
							</div>
						</div>
						<div v-else></div>
						<div class="relative grid grid-cols-[1fr_1fr_auto] items-center gap-2">
							<div v-if="entry.image">
								<svg class="relative h-0.5 w-10 bg-frisch-indigo">
									<line stroke-width="1" x1="0" x2="100%" y1="0" y2="0" />
								</svg>
							</div>
							<div v-else></div>
							<div
								:class="
									entry.image
										? 'prose pl-1 m-0 justify-center text-sm font-bold text-frisch-orange'
										: 'prose m-0 justify-center text-sm font-bold text-frisch-orange'
								"
							>
								{{ entry.year }}
							</div>
							<div>
								<svg
									:class="
										entry.image
											? 'relative h-0.5 w-24 bg-frisch-indigo mr-2'
											: 'relative h-0.5 w-24 bg-frisch-indigo'
									"
								>
									<line stroke-width="1" x1="0" x2="100%" y1="0" y2="0" />
								</svg>
							</div>
						</div>
						<div class="prose prose-p:m-0">
							<ContentRenderer v-if="entry" :value="entry">
								<template #empty></template>
							</ContentRenderer>
						</div>
					</div>
				</div>
			</div>
			<div>
				<svg class="absolute left-1/2 top-0 h-full w-1 translate-x-[-200%] bg-frisch-indigo">
					<line stroke-width="4" x1="0" x2="0" y1="0" y2="100%" />
				</svg>
			</div>
		</div>
	</MainContent>
</template>
