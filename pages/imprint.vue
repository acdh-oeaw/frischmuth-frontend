<script lang="ts" setup>
import { Card, CardContent } from "@/components/ui/card";

defineRouteRules({
	prerender: true,
});
</script>

<template>
	<MainContent class="container grid grid-cols-[auto_1fr] gap-8 px-40 py-8">
		<Card class="size-64 bg-frisch-orange-light">
			<CardContent class="flex size-full py-4 text-xl font-bold text-white">IMPRESSUM</CardContent>
		</Card>
		<Imprint class="prose font-sans prose-h2:text-frisch-orange" />
	</MainContent>
</template>
