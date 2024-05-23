<script lang="ts" setup>
import { Card, CardContent } from "@/components/ui/card";
</script>

<template>
	<MainContent class="container h-full py-8">
		<div class="mx-auto flex size-full w-[850px] grid-cols-3 gap-4 text-xl font-bold">
			<NuxtLink href="/search">
				<Card class="h-full w-[280px] bg-frisch-orange">
					<CardContent class="flex size-full items-center text-white">SUCHE</CardContent>
				</Card>
			</NuxtLink>
			<NuxtLink href="/explore">
				<Card class="h-full w-[280px] bg-frisch-indigo">
					<CardContent class="flex size-full items-center text-white">ENTDECKEN</CardContent>
				</Card>
			</NuxtLink>
			<NuxtLink href="/about">
				<Card class="h-full w-[280px] bg-frisch-grey">
					<CardContent class="flex size-full items-center text-white">ÜBER DAS PROJEKT</CardContent>
				</Card>
			</NuxtLink>
		</div>
	</MainContent>
</template>
