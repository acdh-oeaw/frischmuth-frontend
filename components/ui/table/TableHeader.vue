<script lang="ts" setup>
import type { HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

const props = defineProps<{
	class?: HTMLAttributes["class"];
}>();
</script>

<template>
	<thead :class="cn('[&_tr]:border-b', props.class)">
		<slot />
	</thead>
</template>
