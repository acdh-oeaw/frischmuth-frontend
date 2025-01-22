<script lang="ts" setup>
import { MapPinIcon } from "lucide-vue-next";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { AltausseePlace } from "@/types/content";

const props = defineProps<{
	place: AltausseePlace;
	renderDetail: boolean;
	isMobile: boolean;
}>();

const isOpen = ref(false);

watch(
	() => {
		props.renderDetail;
	},
	() => {
		isOpen.value = true;
	},
	{ immediate: true },
);
</script>

<template>
	<div v-if="props.isMobile">
		<Drawer v-model:open="isOpen">
			<DrawerContent>
				<div class="grid grid-cols-[auto_1fr] items-center gap-1 px-4 pt-2 text-sm">
					<MapPinIcon :size="16" />
					<h1 class="text-lg font-semibold">{{ props.place.title }}</h1>
				</div>
				<!-- TODO add images -->
				<div class="py-2 text-base font-semibold text-black">Beschreibung</div>
				<div v-if="props.place.description !== ''">
					{{ props.place.description }}
				</div>
				<div v-else class="text-sm text-muted-foreground">Keine Beschreibung vorhanden.</div>
				<div v-if="place.links.length > 0">
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
		<Sheet v-model:open="isOpen">
			<SheetContent>
				<div class="grid grid-cols-[auto_1fr] items-center gap-1 pt-2 text-sm">
					<MapPinIcon :size="16" />
					<SheetTitle>{{ props.place.title }}</SheetTitle>
				</div>
				<SheetDescription>
					<div class="py-2 text-base font-semibold text-black">Beschreibung</div>
					<div v-if="props.place.description !== ''">
						{{ props.place.description }}
					</div>
					<div v-else>Keine Beschreibung vorhanden.</div>
				</SheetDescription>
			</SheetContent>
		</Sheet>
	</div>
</template>
