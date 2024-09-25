<script lang="ts" setup>
import "maplibre-gl/dist/maplibre-gl.css";

import { assert } from "@acdh-oeaw/lib";
import { FullscreenControl, Map as GeoMap, NavigationControl, ScaleControl } from "maplibre-gl";

import { type GeoMapContext, geoMapContextKey } from "@/components/map.context";

const props = defineProps<{
	longitude: number;
	latitude: number;
}>();

const elementRef = ref<HTMLElement | null>(null);

const context: GeoMapContext = {
	map: null,
};

onMounted(create);
onScopeDispose(dispose);

async function create() {
	await nextTick();
	assert(elementRef.value != null);

	const map = new GeoMap({
		center: [props.longitude, props.latitude],
		container: elementRef.value,
		maxZoom: 24,
		minZoom: 1,
		pitch: initialViewState.pitch,
		style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // style URL,
		zoom: initialViewState.zoom,
	});

	context.map = map;

	map.on("load", init);
}

function init() {
	assert(context.map != null);
	const map = context.map;

	//

	const nav = new NavigationControl({});
	map.addControl(nav, "top-left");

	//

	const fullscreen = new FullscreenControl({});
	map.addControl(fullscreen, "top-right");

	//

	const scale = new ScaleControl({});
	map.addControl(scale, "bottom-left");

	//
	const placeId = "place-data";
	map.addSource("place-data", {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					properties: {},
					geometry: {
						type: "Point",
						coordinates: [props.longitude, props.latitude],
					},
				},
			],
		},
	});

	//

	map.addLayer({
		id: "points",
		type: "circle",
		source: placeId,
		filter: ["==", "$type", "Point"],
		paint: {
			"circle-color": "rgb(236 81 0)",
			"circle-radius": 6,
		},
	});
}

function dispose() {
	context.map?.remove();
}

defineExpose(context);
provide(geoMapContextKey, context);
</script>

<template>
	<div class="relative grid h-80 text-black">
		<div ref="elementRef" data-geo-map="true" />
		<slot />
	</div>
</template>
