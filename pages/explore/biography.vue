<script lang="ts" setup>
import type { BiographyEntry } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("BiographyPage.meta.title"),
});

const isMobile = ref(false);

onMounted(() => {
	isMobile.value = window.innerWidth < 1024;
});

const { data: biograpies } = await useAsyncData("biography-page", async () => {
	return $fetch<Array<BiographyEntry>>("/api/markdown-folder", {
		body: JSON.stringify({ path: "pages/biography" }),
		method: "POST",
	});
});

const sortedBiographies = computed(() => {
	if (biograpies.value == null) return null;

	const sorted = biograpies.value.slice().sort((a, b) => {
		return Number(a.metadata.year) - Number(b.metadata.year);
	});

	return sorted.slice(0, 10);
});
</script>

<template>
	<MainContent
		class="grid gap-8 p-4 md:grid-cols-[1fr_3fr] md:justify-center md:px-12 lg:py-8 2xl:grid-cols-[2fr_3fr]"
	>
		<div class="md:flex md:justify-end">
			<Card class="aspect-square bg-frisch-indigo md:size-72">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">Biografie</h1>
				</CardContent>
			</Card>
		</div>

		<div>
			<div v-if="biograpies && !isMobile" class="relative w-full max-w-5xl">
				<div>
					<div v-for="(biography, index) in sortedBiographies" :key="index" class="pb-4">
						<div class="grid w-full grid-cols-[1fr_auto_1fr] items-start justify-end gap-4 pb-2">
							<div
								v-if="biography.metadata.image"
								class="grid grid-cols-[auto_1fr] items-end gap-4"
							>
								<div
									v-if="biography.metadata.imageTitle || biography.metadata.copyright"
									class="prose m-0 text-sm"
								>
									<div
										v-if="biography.metadata.imageTitle"
										class="font-semibold text-frisch-indigo"
									>
										{{ biography.metadata.imageTitle }}
									</div>
									<div v-if="biography.metadata.copyright">
										© {{ biography.metadata.copyright }}
									</div>
								</div>
								<div v-else></div>
								<div class="relative block size-full self-end object-contain align-top">
									<NuxtImg
										:alt="biography.metadata.imageTitle ?? ''"
										class="size-full object-contain"
										preload
										:src="biography.metadata.image"
									/>
								</div>
							</div>
							<div v-else></div>
							<div class="relative grid grid-cols-[1fr_1fr_auto] items-center gap-2">
								<div v-if="biography.metadata.image">
									<svg class="relative h-0.5 w-10 bg-frisch-indigo">
										<line stroke-width="1" x1="0" x2="100%" y1="0" y2="0" />
									</svg>
								</div>
								<div v-else></div>
								<div
									:class="
										biography.metadata.image
											? 'prose pl-1 m-0 justify-center text-sm font-bold text-frisch-orange'
											: 'prose m-0 justify-center text-sm font-bold text-frisch-orange'
									"
								>
									{{ biography.metadata.year }}
								</div>
								<div>
									<svg
										:class="
											biography.metadata.image
												? 'relative h-0.5 w-24 bg-frisch-indigo mr-2'
												: 'relative h-0.5 w-24 bg-frisch-indigo'
										"
									>
										<line stroke-width="1" x1="0" x2="100%" y1="0" y2="0" />
									</svg>
								</div>
							</div>
							<div class="prose prose-p:m-0">
								<!-- eslint-disable-next-line vue/no-v-html -->
								<div v-html="biography.body" />
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
			<div v-if="biograpies && isMobile" class="relative">
				<div class="grid auto-rows-max items-start gap-2">
					<div
						v-for="(biography, index) in sortedBiographies"
						:key="index"
						class="grid grid-cols-[auto_1fr] gap-6 pb-4"
					>
						<div>
							<div class="aspect-square size-32">
								<NuxtImg
									:alt="biography.metadata.imageTitle ?? ''"
									class="size-full object-cover"
									preload
									:src="biography.metadata.image"
								/>
							</div>
							<div v-if="biography.metadata.image" class="flex">
								<div
									v-if="biography.metadata.imageTitle || biography.metadata.copyright"
									class="mt-2 text-xs"
								>
									<div
										v-if="biography.metadata.imageTitle"
										class="font-semibold text-frisch-indigo"
									>
										{{ biography.metadata.imageTitle }}
									</div>
									<div v-if="biography.metadata.copyright">
										© {{ biography.metadata.copyright }}
									</div>
								</div>
								<div v-else></div>
							</div>
						</div>
						<div class="grid grid-rows-[auto_1fr]">
							<div
								:class="
									biography.metadata.image
										? 'prose pl-1 m-0 justify-center text-sm font-bold text-frisch-orange'
										: 'prose m-0 justify-center text-sm font-bold text-frisch-orange'
								"
							>
								{{ biography.metadata.year }}
							</div>
							<div class="prose block w-full min-w-full hyphens-manual prose-p:m-0">
								<!-- eslint-disable-next-line vue/no-v-html -->
								<div class="min-w-full" v-html="biography.body" />
							</div>
						</div>
					</div>
				</div>
				<div>
					<svg class="absolute left-[140px] top-0 h-full w-1 bg-frisch-indigo">
						<line stroke-width="4" x1="0" x2="0" y1="0" y2="100%" />
					</svg>
				</div>
			</div>
		</div>
	</MainContent>
</template>
