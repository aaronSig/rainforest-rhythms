import "leaflet/dist/leaflet.css";
import React from "react";
import { GeoJSON, Map, ScaleControl, TileLayer } from "react-leaflet";
import { connect } from "react-redux";
import { Site } from "../../../api/types";
import { focusSiteId } from "../../../app/actions/map";
import { State } from "../../../app/reducers";
import { mapPaneHabitatData, mapPaneSites, mapPaneStreamData } from "../../../app/selectors/maps";
import useBounds from "../../../utils/useBounds";
import { styleForest, styleStreams } from "./featureStyles";
import styles from "./MapPane.module.css";
import { MiniMap } from "./MiniMap";
import SiteMarker from "./SiteMarker";

interface MapPaneProps {
  height?: number;
  width?: number;
  habitatData: null | GeoJSON.GeoJsonObject;
  streamData: null | GeoJSON.GeoJsonObject;
  sites: Site[];
  focusSite: (siteId: number) => void;
}

export function MapPaneView(props: MapPaneProps) {
  const [forestRef, annotatedForestBounds] = useBounds();
  const { habitatData, streamData, sites } = props;

  return (
    <section className={styles.MapPane}>
      {habitatData && (
        <>
          <Map
            bounds={annotatedForestBounds}
            maxBounds={annotatedForestBounds}
            maxZoom={12}
            zoomControl={false}
            style={{ height: props.height, width: props.width, position: "relative" }}
          >
            <TileLayer
              url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              ext="png"
            />
            <ScaleControl position="bottomright" />
            <GeoJSON ref={forestRef} data={habitatData} style={styleForest} />
            {streamData && <GeoJSON data={streamData} style={styleStreams} />}

            {sites.map(s => (
              <SiteMarker key={s.id} site={s} />
            ))}
          </Map>

          <MiniMap focusedBounds={annotatedForestBounds} />
        </>
      )}
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {
    habitatData: mapPaneHabitatData(state),
    streamData: mapPaneStreamData(state),
    sites: mapPaneSites(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    focusSite: (siteId: number) => {
      dispatch(focusSiteId(siteId));
    }
  };
};

const MapPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapPaneView);

export default MapPane;
