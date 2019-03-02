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
        stroke: true,
        color: "#6A9955",
        fill: true,
        fillColor: "#70C38C",
        opacity: 1,
        weight: 0.5,
        fillOpacity: 0.8
      };
    case "logged":
      return {
        stroke: true,
        color: "#CFB283",
        fill: true,
        fillColor: "#CE9178",
        opacity: 1,
        weight: 0.5,
        fillOpacity: 0.8
      };
    case "matrix":
      return {
        stroke: true,
        color: "#C9AD7F",
        fill: true,
        fillColor: "#D9D9A8",
        opacity: 1,
        weight: 0.5,
        fillOpacity: 0.8
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
    opacity: 1,
    weight: 2,
    color: "#99B3CC"
  };
}
