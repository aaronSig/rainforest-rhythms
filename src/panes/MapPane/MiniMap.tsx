import L, { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { Map, Rectangle, TileLayer } from "react-leaflet";
import logo from "../../logo.svg";
import styles from "./MiniMap.module.css";

const WIDTH = 180;
const HEIGHT = 180;

interface MiniMapProps {
  focusedBounds?: LatLngBoundsExpression;
}

const borneoBoundingBox: [number, number][] = [
  [-4.6822871904, 108.4120987684],
  [7.7670030257, 119.7582291395]
];

export const pointerIcon = new L.Icon({
  iconUrl: logo,
  iconRetinaUrl: logo,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [25, 55]
});

export function MiniMap(props: MiniMapProps) {
  return (
    <div className={styles.MiniMap}>
      <Map
        bounds={borneoBoundingBox}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
        tap={false}
        zoomControl={false}
        style={{ height: HEIGHT, width: WIDTH }}
      >
        <TileLayer
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}"
          //   url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}"
          ext="png"
        />

        {/* <Marker position={position} icon={pointerIcon} /> */}

        {props.focusedBounds && <Rectangle bounds={props.focusedBounds} color="black" />}
      </Map>
    </div>
  );
}
