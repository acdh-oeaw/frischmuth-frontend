<script lang="ts" setup>
import { isNonEmptyArray } from "@acdh-oeaw/lib";
import { useQuery } from "@tanstack/vue-query";

import type { StaticPage } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("AcademicReceptionPage.meta.title"),
});

const { data: about, error: aboutError } = useQuery({
	queryKey: ["academic-reception"] as const,
	queryFn() {
		return queryContent<StaticPage>("pages/academic-reception/academic-reception").findOne();
	},
});

const { data: parsedContent } = useAsyncData(
	"academic-reception-page-sections",
	async () => {
		if (!isNonEmptyArray(about.value?.sections)) return [];

		return Promise.all(
			about.value.sections.map((section) => {
				return $fetch("/api/parse-mdc", { body: { input: section.content }, method: "POST" });
			}),
		);
	},
	{ watch: [about] },
);

useErrorMessage(aboutError, {
	notFound: t("AcademicReceptionPage"),
	unknown: t("AcademicReceptionPage.errors.500"),
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

		<div v-if="about && about.sections && about.sections.length" class="prose max-w-3xl">
			<div v-for="(section, index) in about.sections" :key="index" class="pb-4">
				<h2 class="m-0 font-bold text-frisch-orange">{{ section.title }}</h2>
				<ContentRenderer v-if="parsedContent?.[index]" :value="parsedContent[index]">
					<template #empty></template>
				</ContentRenderer>
			</div>
		</div>
	</MainContent>
</template>
