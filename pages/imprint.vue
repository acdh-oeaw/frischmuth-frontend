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
	<MainContent class="container py-8">
		<h1>{{ t("ImprintPage.title") }}</h1>
		<Imprint />
	</MainContent>
</template>
