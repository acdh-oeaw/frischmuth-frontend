<script lang="ts" setup>
defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("IndexPage.meta.title"),
});
</script>

<template>
	<MainContent class="container py-8">
		<h1>{{ t("IndexPage.title") }}</h1>
	</MainContent>
</template>
