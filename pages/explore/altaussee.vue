<script lang="ts" setup>
import * as turf from "@turf/turf";
import type { MapGeoJSONFeature } from "maplibre-gl";

import type { AltausseePlace, StaticPage } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("AltausseePage.meta.title"),
});

const { data } = await useAsyncData("altaussee-page", async () => {
	const page = await $fetch<StaticPage>("/api/markdown-file", {
		body: JSON.stringify({ path: "pages/altaussee/text/altaussee.md" }),
		method: "POST",
	});

	const places = await $fetch<Array<AltausseePlace>>("/api/markdown-folder", {
		body: JSON.stringify({ path: "pages/altaussee/places" }),
		method: "POST",
	});

	return { page, places };
});

const mapData = computed(() => data.value?.places);

const places = computed(() => {
	return mapData.value?.map((place) => {
		return createGeoJsonFeature(place);
	});
});

const isMobile = computed(() => {
	return window.innerWidth < 1024;
});

const currentPlace = ref<AltausseePlace | null>(null);
const popover = ref<{ coordinates: [number, number]; place: AltausseePlace } | null>(null);

function onLayerClick(features: Array<MapGeoJSONFeature & Pick<GeoJsonFeature, "properties">>) {
	let coordinates: [number, number] | null = null;

	const selectedPlace: AltausseePlace | undefined = features
		.map((feature) => {
			return mapData.value?.find((place) => feature.properties._id === place.metadata.title);
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
	<MainContent class="container grid h-full p-4 lg:grid-rows-[auto_1fr] lg:py-8">
		<div class="grid aspect-square lg:h-80 lg:w-full">
			<Map :is-altaussee="true" :places="places" @layer-click="onLayerClick">
				<MapPopup v-if="popover != null" :coordinates="popover.coordinates" @close="popover = null">
					<article class="grid gap-1 text-xs">
						<strong class="font-medium">
							<NavLink
								class="flex cursor-pointer items-center gap-1 underline decoration-dotted hover:no-underline"
								href="#"
								@click="onChangePlaceDetail(true, popover.place)"
							>
								{{ popover.place.metadata.title }}
							</NavLink>
						</strong>
					</article>
				</MapPopup>
			</Map>
		</div>
		<div v-if="data?.page.sections" class="grid w-full pt-4">
			<div
				v-for="(section, index) in data.page.sections"
				:key="index"
				class="prose max-w-full pb-4"
			>
				<h2 class="m-0 font-bold text-frisch-orange">{{ section.title }}</h2>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<section v-html="section.content" />
			</div>
		</div>
		<template v-if="isDetailViewOn">
			<AltausseeSidebar
				:is-mobile="isMobile"
				:place="currentPlace"
				:render-detail="isDetailViewOn"
				@close-side-bar="onChangePlaceDetail(false, null)"
			/>
		</template>
	</MainContent>
</template>
