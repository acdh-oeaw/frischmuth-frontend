<script setup lang="ts">
const props = defineProps<{
	title: string;
	disabled: boolean;
	keyValue: number;
}>();
</script>

<template>
	<Accordion
		:class="['font-normal', disabled ? 'text-frisch-grey' : '']"
		collapsible
		:disabled="disabled"
		type="single"
	>
		<AccordionItem :value="keyValue.toString()">
			<AccordionTrigger>
				<div class="text-lg font-semibold">{{ title }}</div>
			</AccordionTrigger>
			<AccordionContent class="text-base">
				<slot />
			</AccordionContent>
		</AccordionItem>
	</Accordion>
	<div :id="disabled ? '' : 'print-accordion-' + props.title" class="sr-only print:not-sr-only">
		<slot />
	</div>
</template>
