import "leaflet/dist/leaflet.css";
import React from "react";
import { connect } from "react-redux";
import { State } from "../../../state/types";
import MapView from "./Map/MapView";
import styles from "./MapPane.module.css";

interface MapPaneState {
  error: Error | null;
}

export class MapPaneView extends React.Component<any, MapPaneState> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error: error };
  }

  componentDidCatch(error: Error, info: any) {
    console.log("Error rendering the MapPaneView");
    console.error(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <section className={styles.MapPane}>
          <h1>We've encountered an error... please try using another browser</h1>
        </section>
      );
    }

    return (
      <section className={styles.MapPane}>
        <div className={styles.Inner}>
          <MapView />
        </div>
      </section>
    );
  }
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
