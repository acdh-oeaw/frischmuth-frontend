<script lang="ts" setup>
import "maplibre-gl/dist/maplibre-gl.css";

import { assert } from "@acdh-oeaw/lib";
import * as turf from "@turf/turf";
import {
	FullscreenControl,
	type GeoJSONSource,
	Map as GeoMap,
	type MapGeoJSONFeature,
	NavigationControl,
	ScaleControl,
} from "maplibre-gl";

import { type GeoMapContext, geoMapContextKey } from "@/components/map.context";

const props = defineProps<{
	longitude?: number;
	latitude?: number;
	places?: Array<GeoJsonFeature>;
	isAltaussee: boolean;
}>();

const emit = defineEmits<{
	(
		event: "layer-click",
		features: Array<MapGeoJSONFeature & Pick<GeoJsonFeature, "properties">>,
	): void;
}>();

const elementRef = ref<HTMLElement | null>(null);
let map: GeoMap;

const context: GeoMapContext = {
	map: null,
};

onMounted(create);
onScopeDispose(dispose);

async function create() {
	await nextTick();
	assert(elementRef.value != null);

	if (props.isAltaussee) {
		map = new GeoMap({
			center: [13.786, 47.641933], // Altausseer See
			container: elementRef.value,
			maxZoom: 24,
			minZoom: 1,
			style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // style URL,
			zoom: 14,
		});
	} else {
		map = new GeoMap({
			center: [props.longitude ?? 13.786691, props.latitude ?? 47.641933], // default value is Altausseer See
			container: elementRef.value,
			maxZoom: 24,
			minZoom: 1,
			pitch: initialViewState.pitch,
			style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // style URL,
			zoom: initialViewState.zoom,
		});
	}

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

	const placesId = "place-data";
	const singlePlaceId = "single-place";

	//
	map.addSource(placesId, { type: "geojson", data: createFeatureCollection([]) });
	map.addSource(singlePlaceId, { type: "geojson", data: createFeatureCollection([]) });
	//

	map.addLayer({
		id: "places",
		type: "circle",
		source: placesId,
		filter: ["==", "$type", "Point"],
		paint: {
			"circle-color": "rgb(236 81 0)",
			"circle-radius": 6,
		},
	});

	map.addLayer({
		id: "singlePlace",
		type: "circle",
		source: singlePlaceId,
		filter: ["==", "$type", "Point"],
		paint: {
			"circle-color": "rgb(236 81 0)",
			"circle-radius": 6,
		},
	});

	//

	map.on("click", "places", (event) => {
		emit(
			"layer-click",
			(event.features ?? []) as Array<MapGeoJSONFeature & Pick<GeoJsonFeature, "properties">>,
		);
	});

	//

	//

	map.on("mouseenter", "places", () => {
		map.getCanvas().style.cursor = "pointer";
	});

	map.on("mouseleave", "places", () => {
		map.getCanvas().style.cursor = "";
	});

	//

	updateScope();
}
watch(() => {
	return props.isAltaussee;
}, updateScope);

watch(() => {
	return props.places;
}, updateScope);

watch(() => {
	return props.longitude, props.latitude;
}, updateScope);

function updateScope() {
	if (!props.isAltaussee) {
		const singlePlaceId = "single-place";
		const sourcePlace: GeoJSONSource | undefined = map.getSource(singlePlaceId);
		const data: GeoJSON.FeatureCollection = {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					properties: {},
					geometry: {
						type: "Point",
						coordinates: [props.longitude ?? 13.786691, props.latitude ?? 47.641933],
					},
				},
			],
		};

		sourcePlace?.setData(data);
		context.map?.flyTo({ center: [props.longitude ?? 0, props.latitude ?? 0] });
	} else {
		if (props.places != null) {
			assert(context.map != null);
			const map = context.map;

			const placeId = "place-data";
			const sourcePoints: GeoJSONSource | undefined = map.getSource(placeId);
			const geojsonPoints = createFeatureCollection(props.places);

			sourcePoints?.setData(geojsonPoints);

			if (geojsonPoints.features.length > 0) {
				const bounds = turf.bbox(geojsonPoints) as [number, number, number, number];
				map.fitBounds(bounds, { padding: 50, maxZoom: 16 });
			}
		}
	}
}

function dispose() {
	context.map?.remove();
}

defineExpose(context);
provide(geoMapContextKey, context);
</script>

<template>
	<div class="relative grid text-black">
		<div ref="elementRef" data-geo-map="true" />
		<slot />
	</div>
</template>
