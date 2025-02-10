<script lang="ts" setup>
import { DoubleArrowLeftIcon } from "@radix-icons/vue";
import { PaginationFirst, type PaginationFirstProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/styles";

const props = withDefaults(
	defineProps<PaginationFirstProps & { class?: HTMLAttributes["class"] }>(),
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
	<PaginationFirst v-bind="delegatedProps">
		<Button :class="cn('size-10 p-0', props.class)" variant="outline">
			<slot>
				<DoubleArrowLeftIcon />
			</slot>
		</Button>
	</PaginationFirst>
</template>
