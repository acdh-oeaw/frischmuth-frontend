<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core";
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

import { type BadgeVariants, badgeVariants } from ".";

const props = defineProps<
	PrimitiveProps & {
		variant?: BadgeVariants["variant"];
		class?: HTMLAttributes["class"];
	}
>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
	<Primitive
		:class="cn(badgeVariants({ variant }), props.class)"
		data-slot="badge"
		v-bind="delegatedProps"
	>
		<slot />
	</Primitive>
</template>
