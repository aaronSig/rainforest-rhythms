import { GeoJsonObject } from "geojson";
import "leaflet/dist/leaflet.css";
import React from "react";
import { GeoJSON, Map, TileLayer } from "react-leaflet";
import { connect } from "react-redux";
import { Site } from "../../../../api/types";
import {
  getAllSites,
  getFocusedSite,
  getHabitatData,
  getStreamData
} from "../../../../state/selectors";
import { State } from "../../../../state/types";
import useBounds from "../../../../utils/useBounds";
import { styleForest, styleStreams } from "./featureStyles";
import LocationLabel from "./LocationLabel";
import styles from "./MapView.module.css";
import { MiniMap } from "./MiniMap";
import ResizableMap from "./ResizableMap";
import SiteMarker from "./SiteMarker";

interface MapViewProps {
  habitatData: GeoJsonObject | null;
  streamData: GeoJsonObject | null;
  sites: Site[];
  focusedSite: Site | null;
}

function MapView(props: MapViewProps) {
  const { habitatData, streamData, sites } = props;
  const annotatedForestBounds = useBounds(habitatData);

  return (
    <div className={styles.MapPane}>
      {habitatData && annotatedForestBounds && (
        <>
          <ResizableMap>
            <Map
              bounds={annotatedForestBounds}
              maxBounds={annotatedForestBounds}
              maxZoom={12}
              zoomControl={false}
              preferCanvas={true}
              // attributionControl={false}
            >
              <TileLayer
                url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
                attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                ext="jpg"
              />
              {/* <ScaleControl position="bottomleft" /> */}
              <GeoJSON data={habitatData} cursor={"auto"} style={styleForest} />
              {streamData && <GeoJSON data={streamData} style={styleStreams} />}

              {sites.map(s => (
                //@ts-ignore
                <SiteMarker key={s.id} site={s} />
              ))}
            </Map>
          </ResizableMap>

          <MiniMap focusedBounds={annotatedForestBounds} />
          <LocationLabel focusedSite={props.focusedSite} />
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    habitatData: getHabitatData(state),
    streamData: getStreamData(state),
    sites: getAllSites(state),
    focusedSite: getFocusedSite(state)
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
