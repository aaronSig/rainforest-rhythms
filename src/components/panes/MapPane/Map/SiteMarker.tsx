import { divIcon } from "leaflet";
import React from "react";
import { Marker } from "react-leaflet";
import { Site } from "../../../../api/types";
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

export default SiteMarkerView;
