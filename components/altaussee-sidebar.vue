<script lang="ts" setup>
import { MapPinIcon, XIcon } from "lucide-vue-next";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { AltausseePlace } from "@/types/content";

const props = defineProps<{
	place: AltausseePlace | null;
	renderDetail: boolean;
	isMobile: boolean;
}>();

const emit = defineEmits(["closeSideBar"]);

const isOpen = ref(false);
const isClosed = ref(false);

watch(
	() => {
		props.renderDetail;
	},
	() => {
		isOpen.value = true;
	},
	{ immediate: true },
);

let timer: ReturnType<typeof setTimeout> | null = null;

function closeSidebar() {
	isClosed.value = true;
	timer = setTimeout(() => {
		emit("closeSideBar");
	}, 300);
}

onScopeDispose(() => {
	if (timer != null) {
		clearTimeout(timer);
	}
});
</script>

<template>
	<div v-if="props.isMobile && props.place != null">
		<Drawer v-model:open="isOpen">
			<DrawerContent class="px-4">
				<div class="grid grid-cols-[auto_1fr] items-center gap-1 pt-2 text-sm">
					<MapPinIcon :size="16" />
					<h1 class="text-lg font-semibold">{{ props.place.title }}</h1>
				</div>
				<div v-if="props.place.images != null">
					<ImageCarousel :images="props.place.images" />
				</div>
				<div v-if="props.place.description != null">
					<div class="py-2 text-base font-semibold text-black">Beschreibung</div>
					<div>
						{{ props.place.description }}
					</div>
				</div>
				<div v-if="place != null && place.links != null">
					<div v-for="link in place.links" :key="link.url">
						<NavLink
							:href="link.url"
							class="flex cursor-pointer items-center gap-1 underline decoration-dotted hover:no-underline"
						>
							{{ link.workTitle }}
						</NavLink>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	</div>
	<div v-else>
		<div
			v-if="props.renderDetail && props.place != null"
			:data-state="isClosed ? 'closed' : 'open'"
			class="3xl:w-1/6 fixed inset-y-0 right-0 z-50 h-full w-3/4 gap-4 border-l bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5"
		>
			<Button
				variant="transparent"
				class="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
				size="icon"
				@click="closeSidebar()"
			>
				<XIcon class="size-4" />
			</Button>
			<div>
				<div class="grid grid-cols-[auto_1fr] items-center gap-1 pt-2 text-lg font-semibold">
					<MapPinIcon :size="16" />
					<h1>{{ props.place.title }}</h1>
				</div>
				<div v-if="props.place.images != null" class="relative py-4">
					<ImageCarousel :images="props.place.images" />
				</div>
				<div v-if="props.place.description != null">
					<div class="py-2 text-base font-semibold text-black">Beschreibung</div>
					<div>
						{{ props.place.description }}
					</div>
				</div>
				<div v-if="place != null && place.links != null">
					<div v-for="link in place.links" :key="link.url">
						<NavLink
							:href="link.url"
							class="flex cursor-pointer items-center gap-1 underline decoration-dotted hover:no-underline"
						>
							{{ link.workTitle }}
						</NavLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
