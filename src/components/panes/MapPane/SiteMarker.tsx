import { divIcon } from "leaflet";
import React from "react";
import { Marker } from "react-leaflet";
import { connect } from "react-redux";
import { Site } from "../../../api/types";
import { toggleAudioPlayback } from "../../../app/actions/audio";
import { focusSiteId } from "../../../app/actions/map";
import { State } from "../../../app/reducers";
import { audioIsPlaying } from "../../../app/selectors/audio";
import { mapPaneFocusedSiteId } from "../../../app/selectors/maps";
import styles from "./SiteMarker.module.css";

interface SiteMarkerProps {
  site: Site;
  isFocused?: boolean;
  isPlaying?: boolean;
  toggleAudio?: () => void; // play pause
  focus?: () => void;
}

function SiteMarkerView(props: SiteMarkerProps) {
  const { site, isFocused, isPlaying } = props;

  const classes = [
    styles.SiteMarker,
    isFocused && styles.focused,
    isPlaying && styles.playing
  ].filter(c => c !== false);

  const icon = divIcon({
    className: styles.SiteMarkerContainer,
    html: `<div class="${classes.join(" ")}"></div>`
  });

  function onClick() {
    if (props.isFocused) {
      props.toggleAudio!();
    } else {
      props.focus!();
    }
  }

  return (
    <Marker onClick={onClick} position={{ lat: site.latitude, lng: site.longitude }} icon={icon} />
  );
}

const mapStateToProps = (state: State, props: SiteMarkerProps) => {
  const isFocused = mapPaneFocusedSiteId(state) === props.site.id;
  return {
    isFocused,
    isPlaying: isFocused && audioIsPlaying(state)
  };
};

const mapDispatchToProps = (dispatch: any, props: SiteMarkerProps) => {
  return {
    toggleAudio: () => {
      dispatch(toggleAudioPlayback());
    },
    focus: () => {
      console.log("focus");
      dispatch(focusSiteId(props.site.id));
    }
  };
};

const SiteMarker = connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteMarkerView);

export default SiteMarker;
