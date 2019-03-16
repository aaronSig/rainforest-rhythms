import { GeoJsonObject } from "geojson";
import "leaflet/dist/leaflet.css";
import React from "react";
import { GeoJSON, Map, ScaleControl, TileLayer } from "react-leaflet";
import { connect } from "react-redux";
import useResizeAware from "react-resize-aware";
import { Site } from "../../../../api/types";
import { getAllSites, getHabitatData, getStreamData } from "../../../../state/selectors";
import { State } from "../../../../state/types";
import useBounds from "../../../../utils/useBounds";
import { styleForest, styleStreams } from "./featureStyles";
import styles from "./MapView.module.css";
import { MiniMap } from "./MiniMap";
import SiteMarker from "./SiteMarker";

interface MapViewProps {
  habitatData: GeoJsonObject | null;
  streamData: GeoJsonObject | null;
  sites: Site[];
}

function MapView(props: MapViewProps) {
  const [forestRef, annotatedForestBounds] = useBounds();
  const [resizeComponent, containerSize] = useResizeAware();
  const { habitatData, streamData, sites } = props;

  if (resizeComponent) {
    return <NewMap />;
  }

  return (
    <div className={styles.MapPane}>
      {resizeComponent}
      {habitatData && (
        <>
          <Map
            bounds={annotatedForestBounds}
            maxBounds={annotatedForestBounds}
            maxZoom={12}
            zoomControl={false}
            style={{
              height: containerSize.height,
              width: containerSize.width,
              position: "relative"
            }}
          >
            <TileLayer
              // url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}"
              url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              ext="png"
            />
            <ScaleControl position="bottomright" />
            <GeoJSON ref={forestRef} data={habitatData} style={styleForest} />
            {streamData && <GeoJSON data={streamData} style={styleStreams} />}

            {sites.map(s => (
              //@ts-ignore
              <SiteMarker key={s.id} site={s} />
            ))}
          </Map>

          <MiniMap focusedBounds={annotatedForestBounds} />
        </>
      )}
    </div>
  );
}

const borneoBoundingBox: [number, number][] = [
  [-4.6822871904, 108.4120987684],
  [7.7670030257, 119.7582291395]
];
function NewMap() {
  const [resizeComponent, containerSize] = useResizeAware();

  console.log("containerSize", containerSize);
  return (
    <div className={styles.MapPane}>
      {resizeComponent}

      <Map
        center={[51.505, -0.09]}
        // dragging={false}
        // touchZoom={false}
        // doubleClickZoom={false}
        // scrollWheelZoom={false}
        // boxZoom={false}
        // keyboard={false}
        // tap={false}
        // zoomControl={false}
        preferCanvas={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}"
          ext="png"
        />
      </Map>
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    habitatData: getHabitatData(state),
    streamData: getStreamData(state),
    sites: getAllSites(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const BoundMapView = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView);

export default BoundMapView;
