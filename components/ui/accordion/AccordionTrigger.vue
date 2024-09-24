<script setup lang="ts">
import { ChevronDownIcon } from "@radix-icons/vue";
import { AccordionHeader, AccordionTrigger, type AccordionTriggerProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});
</script>

<template>
	<AccordionHeader class="flex">
		<AccordionTrigger
			v-bind="delegatedProps"
			:class="
				cn(
					'flex flex-1 items-center pb-2 justify-between text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180',
					props.class,
				)
			"
		>
			<slot />
			<slot name="icon">
				<ChevronDownIcon
					class="size-4 shrink-0 text-frisch-orange transition-transform duration-200"
				/>
			</slot>
		</AccordionTrigger>
	</AccordionHeader>
</template>
