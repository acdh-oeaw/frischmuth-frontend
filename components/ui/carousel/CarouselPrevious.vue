<script setup lang="ts">
import { ArrowLeftIcon } from "@radix-icons/vue";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/styles";

import type { WithClassAsProps } from "./interface";
import { useCarousel } from "./useCarousel";

const props = defineProps<WithClassAsProps>();

const { orientation, canScrollPrev, scrollPrev } = useCarousel();
</script>

<template>
	<Button
		:class="
			cn(
				'absolute size-8 touch-manipulation rounded-full p-0',
				orientation === 'horizontal'
					? '-left-12 top-1/2 -translate-y-1/2'
					: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
				props.class,
			)
		"
		:disabled="!canScrollPrev"
		variant="outline"
		@click="scrollPrev"
	>
		<slot>
			<ArrowLeftIcon class="size-4 text-current" />
			<span class="sr-only">Previous Slide</span>
		</slot>
	</Button>
</template>
