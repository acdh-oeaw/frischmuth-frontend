<script lang="ts" setup>
import { Separator, type SeparatorProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

const props = defineProps<SeparatorProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});
</script>

<template>
	<Separator
		v-bind="delegatedProps"
		:class="
			cn(
				'shrink-0 bg-border',
				props.orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full',
				props.class,
			)
		"
	/>
</template>
