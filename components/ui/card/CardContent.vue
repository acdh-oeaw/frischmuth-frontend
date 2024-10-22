<script lang="ts" setup>
import type { HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

const props = defineProps<{
	class?: HTMLAttributes["class"];
}>();
</script>

<template>
	<div :class="cn('p-6', props.class)">
		<slot />
	</div>
</template>
