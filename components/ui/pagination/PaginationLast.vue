<script lang="ts" setup>
import { DoubleArrowRightIcon } from "@radix-icons/vue";
import { PaginationLast, type PaginationLastProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/styles";

const props = withDefaults(
	defineProps<PaginationLastProps & { class?: HTMLAttributes["class"] }>(),
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
	<PaginationLast v-bind="delegatedProps">
		<Button :class="cn('w-10 h-10 p-0', props.class)" variant="outline">
			<slot>
				<DoubleArrowRightIcon />
			</slot>
		</Button>
	</PaginationLast>
</template>
