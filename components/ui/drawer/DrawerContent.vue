<script lang="ts" setup>
import { type DialogContentEmits, type DialogContentProps, useForwardPropsEmits } from "radix-vue";
import { DrawerContent, DrawerPortal } from "vaul-vue";
import type { HtmlHTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

import DrawerOverlay from "./DrawerOverlay.vue";

const props = defineProps<DialogContentProps & { class?: HtmlHTMLAttributes["class"] }>();
const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
	<DrawerPortal>
		<DrawerOverlay />
		<DrawerContent
			v-bind="forwarded"
			:class="
				cn(
					'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-full pt-1.5 flex-col border bg-background',
					props.class,
				)
			"
		>
			<div class="mx-auto mb-1.5 h-1 w-[100px] bg-frisch-marine" />
			<slot />
		</DrawerContent>
	</DrawerPortal>
</template>
