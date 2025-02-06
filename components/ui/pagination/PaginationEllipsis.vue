<script lang="ts" setup>
import { DotsHorizontalIcon } from "@radix-icons/vue";
import { PaginationEllipsis, type PaginationEllipsisProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

const props = defineProps<PaginationEllipsisProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});
</script>

<template>
	<PaginationEllipsis
		v-bind="delegatedProps"
		:class="cn('flex size-9 items-center justify-center', props.class)"
	>
		<slot>
			<DotsHorizontalIcon class="size-5" />
		</slot>
	</PaginationEllipsis>
</template>
