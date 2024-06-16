<script lang="ts" setup>
import type { HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

const props = defineProps<{
	class?: HTMLAttributes["class"];
}>();
</script>

<template>
	<div :class="cn('border bg-card text-card-foreground shadow', props.class)">
		<slot />
	</div>
</template>
