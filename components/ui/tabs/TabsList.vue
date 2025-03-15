<script setup lang="ts">
import { TabsList, type TabsListProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

import { cn } from "@/utils/styles.ts";

const props = defineProps<TabsListProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});
</script>

<template>
	<TabsList
		v-bind="delegatedProps"
		:class="
			cn('inline-flex items-center justify-center bg-frisch-grey p-1 text-white', props.class)
		"
	>
		<slot />
	</TabsList>
</template>
