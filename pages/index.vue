<script lang="ts" setup>
defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("IndexPage.meta.title"),
});

const links = {
	search: {
		href: { path: "/search" },
		label: t("IndexPage.links.search"),
		color: "bg-frisch-orange",
	},
	explore: {
		href: { path: "/explore" },
		label: t("IndexPage.links.explore"),
		color: "bg-frisch-indigo",
	},
	about: {
		href: { path: "/about" },
		label: t("IndexPage.links.about"),
		color: "bg-frisch-grey",
	},
};
</script>

<template>
	<MainContent class="h-full py-8">
		<h1 class="sr-only">{{ t("IndexPage.title") }}</h1>
		<div
			class="grid h-full gap-4 text-2xl font-bold sm:grid-cols-[repeat(3,minmax(0,350px))] sm:justify-center"
		>
			<NuxtLink v-for="(link, id) of links" :key="id" :href="link.href">
				<Card class="size-full transition hover:scale-105" :class="link.color">
					<CardContent class="flex size-full items-center uppercase text-white">
						{{ link.label }}
					</CardContent>
				</Card>
			</NuxtLink>
		</div>
	</MainContent>
</template>
