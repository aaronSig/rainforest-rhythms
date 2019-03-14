import { navigate } from "@reach/router";
import { divIcon } from "leaflet";
import React from "react";
import { Marker } from "react-leaflet";
import { connect } from "react-redux";
import { Site, StreamInfo } from "../../../../api/types";
import playMarker from "../../../../icons/play-marker.svg";
import {
  getFocusedSiteId,
  getFocusedTimeSegment,
  getSiteAudioByTimeSegment
} from "../../../../state/selectors";
import { State, TimeSegment } from "../../../../state/types";
import styles from "./SiteMarker.module.css";

interface SiteMarkerProps {
  key: string;
  site: Site;
  isFocused?: boolean;
  isPlaying?: boolean;
  focusedTimeSegment: TimeSegment;
  siteAudioByTimeSegment: { [siteId: string]: { [time in TimeSegment]: StreamInfo[] } };

  toggleAudio?: () => void; // play pause
}

function SiteMarkerView(props: SiteMarkerProps) {
  const { site, isFocused, isPlaying, focusedTimeSegment, siteAudioByTimeSegment } = props;

  const classes = [
    styles.SiteMarker,
    isFocused && styles.focused,
    isPlaying && styles.playing
  ].filter(c => c !== false);

  const icon = divIcon({
    className: styles.SiteMarkerContainer,
    html: `<div class="${classes.join(" ")}">
    <img src="${playMarker}" alt="marker"/>
    </div>`
  });

  function onClick() {
    if (props.isFocused) {
      props.toggleAudio!();
    } else {
      const siteId = site.id;
      let url = `/${focusedTimeSegment}/${siteId}`;
      if (siteId in siteAudioByTimeSegment) {
        const audio = siteAudioByTimeSegment[siteId][focusedTimeSegment];
        if (audio.length) {
          url = `${url}/${audio[0].audio}`;
        }
      }
      navigate(url);
    }
  }

  return (
    <Marker onClick={onClick} position={{ lat: site.latitude, lng: site.longitude }} icon={icon} />
  );
}

const mapStateToProps = (state: State, props: SiteMarkerProps) => {
  const isFocused = getFocusedSiteId(state) === props.site.id;
  return {
    isFocused,
    isPlaying: isFocused && false,
    focusedTimeSegment: getFocusedTimeSegment(state),
    siteAudioByTimeSegment: getSiteAudioByTimeSegment(state)
  };
};

const mapDispatchToProps = (dispatch: any, props: SiteMarkerProps) => {
  return {
    toggleAudio: () => {
      console.log("toggle audio");
    }
  };
};

const SiteMarker = connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteMarkerView);

export default SiteMarker;
