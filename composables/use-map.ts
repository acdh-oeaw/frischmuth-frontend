import { type GeoMapContext, geoMapContextKey } from "@/components/map.context";

export function useGeoMap() {
	const context = inject(geoMapContextKey);

	return context as GeoMapContext;
}
