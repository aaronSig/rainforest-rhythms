import bbox from "@turf/bbox";
import { AllGeoJSON } from "@turf/helpers";
import { GeoJsonObject } from "geojson";
import { LatLngBoundsLiteral } from "leaflet";
import { useMemo } from "react";

/***
 * Calculate a bounding box around some geojson
 */
export default function useBounds(geoJson: AllGeoJSON | GeoJsonObject | null): LatLngBoundsLiteral {
  return useMemo(() => {
    if (!geoJson) {
      return [[0, 0], [0, 0]] as LatLngBoundsLiteral;
    }
    const twoDBox = bbox(geoJson as AllGeoJSON);
    return [[twoDBox[0], twoDBox[1]], [twoDBox[2], twoDBox[3]]] as LatLngBoundsLiteral;
  }, [geoJson]);
}
