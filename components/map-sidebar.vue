<script lang="ts" setup>
import { MapPinIcon, XIcon } from "lucide-vue-next";

import { Drawer, DrawerContent } from "@/components/ui/drawer";

const props = defineProps<{
	place: {
		id: number | undefined;
		name: string | undefined;
		longitude: number | null | undefined;
		latitude: number | null | undefined;
		description: string | undefined;
	};
	workId: number;
	relation: string;
	isMobile: boolean;
}>();

const emit = defineEmits(["closePlaceSideBar"]);

let timer: ReturnType<typeof setTimeout> | null = null;

function closeSidebar() {
	isClosed.value = true;
	if (timer) clearTimeout(timer);
	timer = setTimeout(() => {
		emit("closePlaceSideBar");
	}, 300);
}

const isOpen = ref(false);
const isClosed = ref(false);

watch(
	() => {
		props.place;
	},
	() => {
		isOpen.value = true;
	},
	{ immediate: true },
);

watch(
	() => props.workId,
	(newWork, oldWork) => {
		if (newWork !== oldWork && isOpen.value) {
			closeSidebar();
		}
	},
);
</script>

<template>
	<div v-if="props.isMobile">
		<Drawer v-model:open="isOpen">
			<DrawerContent>
				<div class="flex items-center gap-1 px-4 pt-2 text-sm">
					<MapPinIcon :size="16" />
					{{ props.relation }}
				</div>
				<div class="px-4 pb-2 text-lg font-semibold">{{ props.place.name }}</div>
				<div class="px-4 py-2">
					<div v-if="props.place.longitude != null && props.place.latitude != null">
						<Map
							class="h-80"
							:longitude="props.place.longitude"
							:latitude="props.place.latitude"
							:is-altaussee="false"
						/>
					</div>
					<div class="py-2 text-base font-semibold text-black">Beschreibung</div>
					<div v-if="props.place.description !== ''">
						{{ props.place.description }}
					</div>
					<div v-else class="text-sm text-muted-foreground">Keine Beschreibung vorhanden.</div>
				</div>
			</DrawerContent>
		</Drawer>
	</div>
	<div
		v-else
		:data-state="isClosed ? 'closed' : 'open'"
		class="fixed inset-y-0 right-0 z-50 size-full gap-4 overflow-y-auto border-l bg-background p-8 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
	>
		<div>
			<Button
				variant="transparent"
				class="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
				size="icon"
				@click="closeSidebar()"
			>
				<XIcon class="size-4" />
			</Button>
			<div class="flex items-center gap-1 text-sm">
				<MapPinIcon :size="16" />
				{{ props.relation }}
			</div>
			<h1 class="pb-4 text-lg font-semibold">{{ props.place.name }}</h1>
			<div>
				<div v-if="props.place.longitude != null && props.place.latitude != null">
					<Map
						class="h-80"
						:longitude="props.place.longitude"
						:latitude="props.place.latitude"
						:is-altaussee="false"
					/>
				</div>
				<div
					v-if="props.place.description !== '' && props.place.description != null"
					class="py-4 text-base font-semibold text-black"
				>
					Beschreibung
				</div>
				<div>
					{{ props.place.description }}
				</div>
			</div>
		</div>
	</div>
</template>
