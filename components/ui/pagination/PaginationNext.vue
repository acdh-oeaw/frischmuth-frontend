<script lang="ts" setup>
import { ChevronRightIcon } from "@radix-icons/vue";
import { PaginationNext, type PaginationNextProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/styles";

const props = withDefaults(
	defineProps<PaginationNextProps & { class?: HTMLAttributes["class"] }>(),
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
	<PaginationNext v-bind="delegatedProps">
		<Button :class="cn('w-10 h-10 p-0', props.class)" variant="outline">
			<slot>
				<ChevronRightIcon />
			</slot>
		</Button>
	</PaginationNext>
</template>
