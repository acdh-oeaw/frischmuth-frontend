<script lang="ts" setup>
import { XIcon } from "lucide-vue-next";

import type { WorkDetail } from "@/types/api";

const props = defineProps<{
	work: WorkDetail;
	isTablet: boolean;
	show: boolean;
}>();

const emit = defineEmits(["closeSideBar"]);

const isOpen = ref(false);
const isClosed = ref(false);

watch(
	() => {
		props.show;
	},
	() => {
		isOpen.value = true;
	},
	{ immediate: true },
);

watch(
	() => props.work,
	(newWork, oldWork) => {
		if (newWork !== oldWork && isOpen.value) {
			closeSidebar();
		}
	},
);

let timer: ReturnType<typeof setTimeout> | null = null;

function closeSidebar() {
	isClosed.value = true;
	if (timer) clearTimeout(timer);
	timer = setTimeout(() => {
		emit("closeSideBar");
	}, 300);
}

const analysisTags = computed(() => {
	return [
		{ name: "Zeitliche Ordnung", value: props.work.temporal_order?.[0] },
		{ name: "Zeitliche Dauer", value: props.work.temporal_duration?.[0] },
		{ name: "Zeitliche Häufigkeit", value: props.work.temporal_frequency?.[0] },
		{ name: "Stilfigur", value: props.work.figure_speech?.[0] },
		{ name: "Fokalisierung", value: props.work.focalization?.[0] },
		{ name: "Narrative Situation", value: props.work.narrative_situation?.[0] },
		{ name: "Narrative Chronologie", value: props.work.narrative_chronology?.[0] },
		{ name: "Narrative Ebene", value: props.work.narrative_level?.[0] },
		{ name: "Narrative Stimme", value: props.work.narrative_voice?.[0] },
	].filter((item) => item.value !== undefined);
});
</script>

<template>
	<div
		:data-state="isClosed ? 'closed' : 'open'"
		class="fixed inset-y-0 right-0 z-50 size-full gap-4 overflow-y-auto border-l bg-background shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
	>
		<Button
			variant="transparent"
			class="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
			size="icon"
			@click="closeSidebar()"
		>
			<XIcon class="size-4" />
		</Button>
		<div class="grid grid-cols-[auto_1fr] items-center gap-4">
			<div
				class="size-0 border-y-[55px] border-l-[55px] border-y-transparent border-l-frisch-marine"
			></div>

			<div class="py-2 text-lg font-semibold">Analyse</div>
		</div>
		<div class="block hyphens-auto px-16 text-justify">
			<div v-if="props.work?.text_analysis">
				{{ props.work?.text_analysis }}
			</div>
			<div v-if="analysisTags.length > 0" class="py-4">
				<span v-for="tag in analysisTags" :key="tag.name" class="mb-2 mr-1">
					<span v-if="!isTablet">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger as-child>
									<span
										class="mb-1 inline-block cursor-default bg-frisch-orange px-2 py-1 text-xs text-white opacity-85"
									>
										{{ tag.value }}
									</span>
								</TooltipTrigger>
								<TooltipContent>
									<p>{{ tag.name }}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</span>
					<span v-else>
						<Popover>
							<PopoverTrigger>
								<span
									class="mb-1 inline-block cursor-default bg-frisch-orange px-2 py-1 text-xs text-white opacity-85"
								>
									{{ tag.value }}
								</span>
							</PopoverTrigger>
							<PopoverContent>
								{{ tag.name }}
							</PopoverContent>
						</Popover>
					</span>
				</span>
			</div>
		</div>
	</div>
</template>
