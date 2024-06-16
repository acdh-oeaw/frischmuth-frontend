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
	<MainContent class="container grid grid-cols-[2fr_3fr] gap-8 px-40 py-8">
		<div class="flex justify-end">
			<Card class="size-72 bg-frisch-orange">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">{{ t("ImprintPage.title") }}</h1>
				</CardContent>
			</Card>
		</div>
		<Imprint class="prose prose-h2:text-frisch-orange" />
	</MainContent>
</template>
