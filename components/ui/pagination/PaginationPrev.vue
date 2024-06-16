<script lang="ts" setup>
import { ChevronLeftIcon } from "@radix-icons/vue";
import { PaginationPrev, type PaginationPrevProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/styles";

const props = withDefaults(
	defineProps<PaginationPrevProps & { class?: HTMLAttributes["class"] }>(),
	{
		asChild: true,
	},
);

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});
</script>

<template>
	<PaginationPrev v-bind="delegatedProps">
		<Button :class="cn('w-10 h-10 p-0', props.class)" variant="outline">
			<slot>
				<ChevronLeftIcon />
			</slot>
		</Button>
	</PaginationPrev>
</template>
