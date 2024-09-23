<script setup lang="ts">
import { Cross2Icon } from "@radix-icons/vue";
import {
	DialogClose,
	DialogContent,
	type DialogContentEmits,
	type DialogContentProps,
	DialogOverlay,
	DialogPortal,
	useForwardPropsEmits,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

import { cn } from "@/utils/styles";

import { type SheetVariants, sheetVariants } from ".";

interface SheetContentProps extends DialogContentProps {
	class?: HTMLAttributes["class"];
	side?: SheetVariants["side"];
}

const route = useRoute();
const router = useRouter();

defineOptions({
	inheritAttrs: false,
});

const props = defineProps<SheetContentProps>();

const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { class: _, side, ...delegated } = props;

	return delegated;
});

function closeSidebar() {
	const query = { place: route.query.place };
	delete query.place;
	void router.push({ query });
}

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<DialogPortal>
		<DialogOverlay
			class="fixed inset-0 z-50 bg-frisch-indigo/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
			@click="closeSidebar()"
		/>
		<DialogContent
			:class="cn(sheetVariants({ side }), props.class)"
			v-bind="{ ...forwarded, ...$attrs }"
		>
			<slot />

			<DialogClose
				class="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
				@click="closeSidebar()"
			>
				<Cross2Icon class="size-4" />
			</DialogClose>
		</DialogContent>
	</DialogPortal>
</template>
