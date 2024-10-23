<script lang="ts" setup>
defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("ImprintPage.meta.title"),
});
</script>

<template>
	<MainContent
		class="grid gap-8 p-4 md:grid-cols-[1fr_3fr] md:justify-center md:px-12 2xl:grid-cols-[2fr_3fr]"
	>
		<div class="flex md:justify-end">
			<Card class="aspect-square size-full bg-frisch-orange md:size-72">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">{{ t("ImprintPage.title") }}</h1>
				</CardContent>
			</Card>
		</div>
		<Imprint class="prose prose-h2:text-frisch-orange 2xl:max-w-3xl" />
	</MainContent>
</template>
