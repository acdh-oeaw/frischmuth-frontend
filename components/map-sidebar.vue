<script lang="ts" setup>
import { EyeIcon, MapPinIcon } from "lucide-vue-next";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const router = useRouter();

const props = defineProps<{
	place: {
		id: number | undefined;
		name: string | undefined;
		longitude: number | null | undefined;
		latitude: number | null | undefined;
		description: string | undefined;
	};
	relation: string;
	isMobile: boolean;
}>();

function setPlaceQuery(id: number | undefined) {
	if (id != null) {
		void router.push({
			query: { place: id },
		});
	}
}
</script>

<template>
	<div v-if="props.isMobile">
		<Drawer>
			<DrawerTrigger class="w-full">
				<EyeIcon :size="16" class="text-frisch-orange" />
			</DrawerTrigger>
			<DrawerContent>
				<div class="flex items-center gap-1 px-4 pt-2 text-sm">
					<MapPinIcon :size="16" />
					{{ props.relation }}
				</div>
				<div class="px-4 pb-2 text-lg font-semibold">{{ props.place.name }}</div>
				<div class="px-4 py-2">
					<div v-if="props.place.longitude != null && props.place.latitude != null">
						<Map
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
	<div v-else>
		<Sheet>
			<SheetTrigger as-child @click="setPlaceQuery(props.place.id)">
				<EyeIcon :size="16" class="text-frisch-orange" />
			</SheetTrigger>
			<SheetContent>
				<div class="flex items-center gap-1 text-sm">
					<MapPinIcon :size="16" />
					{{ props.relation }}
				</div>
				<SheetTitle class="pb-2">{{ props.place.name }}</SheetTitle>
				<SheetDescription>
					<div v-if="props.place.longitude != null && props.place.latitude != null">
						<Map :longitude="props.place.longitude" :latitude="props.place.latitude" />
					</div>
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
