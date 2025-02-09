<script lang="ts" setup>
import type { StaticPage } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("ThemesPage.meta.title"),
});

const { data: page } = await useAsyncData("themes-page", async () => {
	return $fetch<StaticPage>("/api/markdown-file", {
		body: JSON.stringify({ path: "pages/themes/themes.md" }),
		method: "POST",
	});
});
</script>

<template>
	<MainContent
		class="grid gap-8 p-4 py-8 md:grid-cols-[1fr_3fr] md:justify-center md:px-12 2xl:grid-cols-[2fr_3fr]"
	>
		<div class="flex md:justify-end">
			<Card class="aspect-square size-full bg-frisch-orange md:size-72">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">{{ t("ThemesPage.title") }}</h1>
				</CardContent>
			</Card>
		</div>

		<!-- eslint-disable-next-line vue/no-v-html -->
		<div class="prose max-w-3xl" v-html="page?.body" />
	</MainContent>
</template>
