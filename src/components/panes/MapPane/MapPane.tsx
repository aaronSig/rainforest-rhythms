import { Feature, GeometryObject } from "geojson";
import { PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { GeoJSON, Map, TileLayer } from "react-leaflet";
import api from "../../../api/api";
import useBounds from "../../../utils/useBounds";
import styles from "./MapPane.module.css";
import { MiniMap } from "./MiniMap";

interface MapPaneProps {
  height?: number;
  width?: number;
  interactive: boolean;
}

let habitatData = null;
let streamData = null;

export function MapPane(props: MapPaneProps) {
  const [forestRef, annotatedForestBounds] = useBounds();
  const [habitatData, setHabitatData] = useState(null as null | GeoJSON.GeoJsonObject);
  const [streamData, setStreamData] = useState(null as null | GeoJSON.GeoJsonObject);

  useEffect(() => {
    api.geoJson.habitats().then(h => setHabitatData(h));
    api.geoJson.streams().then(s => setStreamData(s));
  }, []);

  return (
    <section className={styles.MapPane}>
      {habitatData && (
        <>
          <Map
            bounds={annotatedForestBounds}
            maxBounds={annotatedForestBounds}
            maxZoom={12}
            // dragging={props.interactive}
            // touchZoom={props.interactive}
            // doubleClickZoom={props.interactive}
            // scrollWheelZoom={props.interactive}
            // boxZoom={props.interactive}
            // keyboard={props.interactive}
            // tap={props.interactive}
            zoomControl={props.interactive}
            style={{ height: props.height, width: props.width, position: "relative" }}
          >
            <TileLayer
              // url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}"
              // url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}"
              // url="http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg"
              url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              ext="png"
            />
            <GeoJSON ref={forestRef} data={habitatData} style={styleForest} />
            {streamData && <GeoJSON data={streamData} style={styleStreams} />}
          </Map>

          <MiniMap focusedBounds={annotatedForestBounds} />
        </>
      )}
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

function styleStreams(feature?: Feature<GeometryObject, any>): PathOptions {
  return {
    stroke: true,
    opacity: 1,
    weight: 2,
    color: "#99B3CC"
  };
}
