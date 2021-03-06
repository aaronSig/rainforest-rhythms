import bbox from "@turf/bbox";
import { AllGeoJSON } from "@turf/helpers";
import { GeoJsonObject } from "geojson";
import { LatLngBoundsLiteral } from "leaflet";
import { useMemo } from "react";

/***
 * Calculate a bounding box around some geojson
 */
export default function useBounds(
  geoJson: AllGeoJSON | GeoJsonObject | null
): LatLngBoundsLiteral | null {
  return useMemo(() => {
    if (!geoJson) {
      return null;
    }
    const twoDBox = bbox(geoJson as AllGeoJSON);
    return [[twoDBox[1], twoDBox[0]], [twoDBox[3], twoDBox[2]]] as LatLngBoundsLiteral;
  }, [geoJson]);
}
