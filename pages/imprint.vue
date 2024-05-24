<script lang="ts" setup>
import { Card, CardContent } from "@/components/ui/card";

defineRouteRules({
	prerender: true,
});
</script>

<template>
	<MainContent class="container grid grid-cols-[2fr_3fr] gap-8 px-40 py-8">
		<div class="flex justify-end">
			<Card class="size-72 bg-frisch-orange-light">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					IMPRESSUM
				</CardContent>
			</Card>
		</div>
		<Imprint class="prose prose-h2:text-frisch-orange" />
	</MainContent>
</template>
