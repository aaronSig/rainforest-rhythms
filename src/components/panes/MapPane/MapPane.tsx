import "leaflet/dist/leaflet.css";
import React from "react";
import { connect } from "react-redux";
import { State } from "../../../state/types";
import { Navigation } from "../../Navigation/Navigation";
import InfoBar from "./InfoBar/InfoBar";
import MapView from "./Map/MapView";
import styles from "./MapPane.module.css";

interface MapPaneProps {
  height?: number;
  width?: number;
}

export function MapPaneView(props: MapPaneProps) {
  return (
    <section className={styles.MapPane}>
      <Navigation />
      <MapView width={props.width} height={(props.height || 200) - 200} />
      <InfoBar />
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const MapPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapPaneView);

export default MapPane;
