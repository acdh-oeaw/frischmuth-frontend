<script lang="ts" setup>
import { EyeIcon, MapPinIcon } from "lucide-vue-next";

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
</template>
