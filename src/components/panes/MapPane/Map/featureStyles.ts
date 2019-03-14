import { Feature, GeometryObject } from "geojson";
import { PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 *  Styling for the GEOJson map features
 */

export function styleForest(feature?: Feature<GeometryObject, any>): PathOptions {
  const type: string = (feature as any).properties.type;
  switch (type) {
    case "primary":
      return {
        stroke: false,
        fill: true,
        fillColor: "#04463e",
        fillOpacity: 0.8
      };
    case "logged":
      return {
        stroke: false,
        fill: true,
        fillColor: "#04463e",
        fillOpacity: 0.6
      };
    case "matrix":
      return {
        stroke: false,
        fill: true,
        fillColor: "#04463e",
        fillOpacity: 0.4
      };
  }

  return {
    stroke: true,
    color: "white"
  };
}

export function styleStreams(feature?: Feature<GeometryObject, any>): PathOptions {
  return {
    stroke: true,
    opacity: 0.3,
    weight: 2,
    color: "#39c0ff"
  };
}
