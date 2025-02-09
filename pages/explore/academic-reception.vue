<script lang="ts" setup>
import type { StaticPage } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("AcademicReceptionPage.meta.title"),
});

const { data: page } = await useAsyncData("academic-reception-page", async () => {
	return $fetch<StaticPage>("/api/markdown-file", {
		body: JSON.stringify({ path: "pages/academic-reception/academic-reception.md" }),
		method: "POST",
	});
});
</script>

<template>
	<MainContent
		class="grid gap-8 p-4 md:grid-cols-[1fr_3fr] md:justify-center md:px-12 lg:py-8 2xl:grid-cols-[2fr_3fr]"
	>
		<div class="flex md:justify-end">
			<Card class="aspect-square size-full bg-frisch-grey md:size-72">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-frisch-indigo">
					<h1>{{ t("AcademicReceptionPage.title") }}</h1>
				</CardContent>
			</Card>
		</div>

		<div v-if="page?.sections" class="prose max-w-3xl">
			<div v-for="(section, index) in page.sections" :key="index" class="pb-4">
				<h2 class="m-0 font-bold text-frisch-orange">{{ section.title }}</h2>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<section v-html="section.content" />
			</div>
		</div>
	</MainContent>
</template>
