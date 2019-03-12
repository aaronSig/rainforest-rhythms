import { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { Map, Rectangle, TileLayer } from "react-leaflet";
import styles from "./MiniMap.module.css";

const WIDTH = 100;
const HEIGHT = 100;

interface MiniMapProps {
  focusedBounds?: LatLngBoundsExpression;
}

const borneoBoundingBox: [number, number][] = [
  [-4.6822871904, 108.4120987684],
  [7.7670030257, 119.7582291395]
];

export function MiniMap(props: MiniMapProps) {
  return (
    <div className={styles.MiniMap} style={{ height: HEIGHT, width: WIDTH }}>
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
        preferCanvas={true}
        style={{ height: HEIGHT, width: WIDTH }}
        attributionControl={false}
      >
        <TileLayer
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}"
          ext="png"
        />
        {props.focusedBounds && <Rectangle bounds={props.focusedBounds} color="red" />}
      </Map>
    </div>
  );
}
