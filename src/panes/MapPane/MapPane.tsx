import { Feature, GeometryObject } from "geojson";
import { PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import { GeoJSON, Map, TileLayer } from "react-leaflet";
import mapData from "./map-data.json";
import styles from "./MapPane.module.css";
import { MiniMap } from "./MiniMap";
import streamData from "./stream-data.json";

interface MapPaneProps {
  height?: number;
  width?: number;
  interactive: boolean;
}

export function MapPane(props: MapPaneProps) {
  const featuresRef = useRef(null);
  const [bounds, setBounds] = useState();
  useEffect(() => {
    if (featuresRef.current) {
      const featureBounds = (featuresRef.current as any).leafletElement.getBounds();
      setBounds(featureBounds);
    }
  }, [featuresRef.current]);

  console.log(props.width);

  return (
    <section className={styles.MapPane}>
      <Map
        bounds={bounds}
        dragging={props.interactive}
        touchZoom={props.interactive}
        doubleClickZoom={props.interactive}
        scrollWheelZoom={props.interactive}
        boxZoom={props.interactive}
        keyboard={props.interactive}
        tap={props.interactive}
        zoomControl={props.interactive}
        style={{ height: props.height, width: 915, position: "relative" }}
      >
        <TileLayer
          // url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}"
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}"
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          ext="png"
        />

        <GeoJSON ref={featuresRef} data={mapData as any} style={styleForest} />
        <GeoJSON data={streamData as any} style={styleStreams} />
      </Map>

      <MiniMap focusedBounds={bounds} />
    </section>
  );
}

function styleForest(feature?: Feature<GeometryObject, any>): PathOptions {
  const type: string = (feature as any).properties.type;
  switch (type) {
    case "primary":
      return {
        stroke: true,
        color: "#6A9955",
        fill: true,
        fillColor: "#70C38C",
        opacity: 1,
        fillOpacity: 0.9
      };
    case "logged":
      return {
        stroke: true,
        color: "#CFB283",
        fill: true,
        fillColor: "#CE9178",
        opacity: 1,
        fillOpacity: 0.9
      };
    case "matrix":
      return {
        stroke: true,
        color: "#C9AD7F",
        fill: true,
        fillColor: "#D9D9A8",
        opacity: 1,
        fillOpacity: 0.9
      };
  }

  return {
    stroke: true,
    color: "white"
  };
}

function styleStreams(feature?: Feature<GeometryObject, any>): PathOptions {
  return {
    stroke: true,
    opacity: 0.7,
    color: "#99D9FA"
  };
}
