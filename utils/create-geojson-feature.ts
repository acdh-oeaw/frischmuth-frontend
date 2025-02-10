import type { Feature, Geometry } from "geojson";

import type { AltausseePlace } from "@/types/content";

export type GeoJsonFeature = Feature<Geometry, { _id: string }>;

export function createGeoJsonFeature(place: AltausseePlace): GeoJsonFeature {
	return {
		type: "Feature",
		geometry: {
			coordinates: [place.metadata.coordinates.longitude, place.metadata.coordinates.latitude],
			type: "Point",
		},
		properties: {
			_id: place.metadata.title,
		},
	};
}
