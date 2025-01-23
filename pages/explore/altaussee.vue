<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import * as turf from "@turf/turf";
import type { MapGeoJSONFeature } from "maplibre-gl";

import type { AltausseePlace } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("AltausseePage.meta.title"),
});

const { data: mapData, error } = useQuery({
	queryKey: ["mapData"] as const,
	queryFn() {
		return queryContent<AltausseePlace>("pages/altaussee/places").find();
	},
});

const places = computed(() => {
	return mapData.value?.map((place) => {
		return createGeoJsonFeature(place);
	});
});

useErrorMessage(error, {
	notFound: t("AltausseePage.errors.404"),
	unknown: t("AltausseePage.errors.500"),
});

const currentPlace = ref<AltausseePlace | null>(null);
const popover = ref<{ coordinates: [number, number]; place: AltausseePlace } | null>(null);

function onLayerClick(features: Array<MapGeoJSONFeature & Pick<GeoJsonFeature, "properties">>) {
	let coordinates: [number, number] | null = null;

	const selectedPlace: AltausseePlace | undefined = features
		.map((feature) => {
			return mapData.value?.find((place) => feature.properties._id === place.title);
		})
		.find((place) => place !== undefined);

	for (const feature of features) {
		if (feature.geometry.type === "Point") {
			coordinates = feature.geometry.coordinates as [number, number];
			break;
		}
	}

	if (!coordinates && features.length > 0) {
		coordinates = turf.center(createFeatureCollection(features)).geometry.coordinates as [
			number,
			number,
		];
	}

	if (coordinates != null && selectedPlace != null) {
		popover.value = {
			coordinates: coordinates,
			place: selectedPlace,
		};
	}
}

const isDetailViewOn = ref(false);

function onChangePlaceDetail(toggleValue: boolean, place: AltausseePlace | null) {
	currentPlace.value = place;
	isDetailViewOn.value = toggleValue;
}
</script>

<template>
	<MainContent class="container h-full py-4">
		<div class="grid w-full">
			<Map :is-altaussee="true" :places="places" @layer-click="onLayerClick">
				<MapPopup v-if="popover != null" :coordinates="popover.coordinates" @close="popover = null">
					<article class="grid gap-1 text-xs">
						<strong class="font-medium">
							<NavLink
								href="#"
								class="flex cursor-pointer items-center gap-1 underline decoration-dotted hover:no-underline"
								@click="onChangePlaceDetail(true, popover.place)"
							>
								{{ popover.place.title }}
							</NavLink>
						</strong>
					</article>
				</MapPopup>
			</Map>
			<template v-if="isDetailViewOn">
				<AltausseeSidebar
					:render-detail="isDetailViewOn"
					:is-mobile="false"
					:place="currentPlace"
					@close-side-bar="onChangePlaceDetail(false, null)"
				/>
			</template>
		</div>
	</MainContent>
</template>
