<script lang="ts" setup>
import {
	SliderRange,
	SliderRoot,
	type SliderRootEmits,
	type SliderRootProps,
	SliderThumb,
	SliderTrack,
	useForwardPropsEmits,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

const props = defineProps<SliderRootProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<SliderRootEmits>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<SliderRoot
		:class="cn('relative flex w-full touch-none select-none items-center', props.class)"
		v-bind="forwarded"
	>
		<SliderTrack class="relative h-1.5 w-full grow overflow-hidden bg-frisch-orange-light/60">
			<SliderRange class="absolute h-full bg-frisch-orange" />
		</SliderTrack>
		<SliderThumb
			v-for="(_, key) in modelValue"
			:key="key"
			class="block size-5 border border-frisch-orange bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
		/>
	</SliderRoot>
</template>
