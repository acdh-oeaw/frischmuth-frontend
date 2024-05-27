<script lang="ts" setup>
import { Card, CardContent } from "@/components/ui/card";

const t = useTranslations();

usePageMetadata({
	title: t("IndexPage.meta.title"),
});
</script>

<template>
	<MainContent class="container h-full py-8">
		<div
			class="mx-auto grid size-full w-1/2 grid-cols-[1fr_1fr_1fr] justify-center gap-4 text-2xl font-bold"
		>
			<NuxtLink href="/search">
				<Card class="size-full bg-frisch-orange transition hover:scale-[105%]">
					<CardContent class="flex size-full items-center text-white">SUCHE</CardContent>
				</Card>
			</NuxtLink>
			<NuxtLink href="/explore">
				<Card class="size-full bg-frisch-indigo transition hover:scale-[105%]">
					<CardContent class="flex size-full items-center text-white">ENTDECKEN</CardContent>
				</Card>
			</NuxtLink>
			<NuxtLink href="/about">
				<Card class="size-full bg-frisch-grey transition hover:scale-[105%]">
					<CardContent class="flex size-full items-center text-white">ÜBER DAS PROJEKT</CardContent>
				</Card>
			</NuxtLink>
		</div>
	</MainContent>
</template>
