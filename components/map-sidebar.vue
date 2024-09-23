<script lang="ts" setup>
import { EyeIcon, MapPinIcon } from "lucide-vue-next";

const router = useRouter();

const props = defineProps<{
	place: {
		id: number;
		name: string;
		longitude: number;
		latitude: number;
		description: string | undefined;
	};
	relation: string;
}>();

function setPlaceQuery(id: number) {
	void router.push({ place: id });
}
</script>

<template>
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
				<Map :longitude="props.place.longitude" :latitude="props.place.latitude" />
				<div class="py-2 text-base font-semibold text-black">Beschreibung</div>
				<div v-if="props.place.description !== ''">
					{{ props.place.description }}
				</div>
				<div v-else>Keine Beschreibung vorhanden.</div>
			</SheetDescription>
		</SheetContent>
	</Sheet>
</template>
