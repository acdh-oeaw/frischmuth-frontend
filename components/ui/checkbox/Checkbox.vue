<script setup lang="ts">
import { CheckIcon } from "@radix-icons/vue";
import {
	CheckboxIndicator,
	CheckboxRoot,
	type CheckboxRootEmits,
	type CheckboxRootProps,
	useForwardPropsEmits,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

const props = defineProps<CheckboxRootProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});

// FIXME: fix types later!
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const forwarded = useForwardPropsEmits(delegatedProps, emits) as any;
</script>

<template>
	<CheckboxRoot
		v-bind="forwarded"
		:class="
			cn(
				'peer h-4 w-4 shrink-0 border border-frisch-orange focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-frisch-orange data-[state=checked]:text-primary-foreground',
				props.class,
			)
		"
	>
		<CheckboxIndicator class="flex size-full items-center justify-center text-current">
			<slot>
				<CheckIcon class="size-4" />
			</slot>
		</CheckboxIndicator>
	</CheckboxRoot>
</template>
