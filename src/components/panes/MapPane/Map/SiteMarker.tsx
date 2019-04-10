import { navigate } from "@reach/router";
import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { Site, StreamInfo, TimeSegment } from "../../../../api/types";
import { toggleSiteAudioPlayState } from "../../../../state/actions";
import {
  getFocusedSiteId,
  getFocusedTimeSegment,
  getSiteAudio,
  getSiteAudioByTimeSegment
} from "../../../../state/selectors";
import { SiteAudioState, State } from "../../../../state/types";
import PlayButton from "../../../buttons/play/PlayButton";
import HabitatIcon from "../InfoBar/HabitatIcon/HabitatIcon";
import ReactMarker from "./ReactMarker";
import styles from "./SiteMarker.module.css";

interface SiteMarkerProps {
  key: string;
  site: Site;
  isFocused?: boolean;
  siteAudioState: SiteAudioState;
  focusedTimeSegment: TimeSegment;
  siteAudioByTimeSegment: { [siteId: string]: { [time in TimeSegment]: StreamInfo[] } };

  toggleAudio?: () => void; // play pause
}

function SiteMarkerView(props: SiteMarkerProps) {
  const {
    site,
    isFocused,
    siteAudioState,
    focusedTimeSegment,
    siteAudioByTimeSegment,
    toggleAudio
  } = props;

  const onClick = useCallback(() => {
    if (isFocused) {
      toggleAudio!();
    } else {
      // Update the url to selete the site & and an audio ID if one is loaded
      // if not another component will attempt to load one
      const siteId = site.id;
      let url = `/${focusedTimeSegment}/${siteId}`;
      if (siteId in siteAudioByTimeSegment) {
        const audio = siteAudioByTimeSegment[siteId][focusedTimeSegment];
        if (audio.length) {
          url = `${url}/${audio[0].audio}`;
        }
      }
      console.log("Selecting Site");
      navigate(url);
    }
  }, [focusedTimeSegment, isFocused, toggleAudio, site.id, siteAudioByTimeSegment]);

  const { isPlaying } = siteAudioState;
  const classes = useMemo(() => {
    return [styles.SiteMarker, isFocused && styles.focused, isPlaying && styles.playing]
      .filter(c => c !== false)
      .join(" ");
  }, [isFocused, isPlaying]);

  let loading = false;
  let paused = true;
  let label = `Select recording site ${site.site_name}`;
  if (isFocused) {
    // only updated the state for the focused marker
    // the others should just show the play button
    loading = !siteAudioState.isPlaying && !siteAudioState.isReady;
    paused = !siteAudioState.isPlaying;

    if (loading) {
      label = `Loading audio for recording site ${site.site_name}`;
    } else {
      if (paused) {
        label = `Play audio from recording site ${site.site_name}`;
      } else if (paused) {
        label = `Pause audio from recording site ${site.site_name}`;
      }
    }
  }

  return (
    <ReactMarker
      id={`site-${site.id}`}
      onClick={onClick}
      position={{ lat: site.latitude, lng: site.longitude }}
    >
      <div className={classes}>
        <div className={styles.inner}>
          <svg viewBox="0 0 73 96" version="1.1">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path
                d="M57.7675015,64.4287612 C59.0164546,63.4768234 60.2115579,62.4342052 61.3428816,61.3028816 C71.4553274,51.1904357 74.4803442,35.9820871 69.0073412,22.7696173 C63.5343381,9.55714743 50.641158,0.942595538 36.34,0.943 C16.8128681,0.943 0.983,16.7728681 0.983,36.3 C0.982727437,45.9374274 4.89476172,54.9354503 11.4897523,61.4541311 C11.4964728,61.4845271 11.5,61.5 11.5,61.5 C11.5,61.5 11.5211751,61.5084154 11.5624505,61.5257809 C14.4267424,64.3406224 17.7932637,66.6893021 21.5621975,68.4224265 C24.0706036,70.724368 26.8134008,73.7020345 29.5,77.5 C34.831,85.036 38,95.5 38,95.5 C37.9999868,95.4999903 39.4761101,86.01 45.1621101,77.5 C49.5153607,70.9882817 54.5927419,67.3327371 57.7675015,64.4287612 Z"
                strokeOpacity="1"
                stroke="#FFFFFF"
                fillOpacity="1"
                fill="#E23E1D"
              />
            </g>
          </svg>
          {isFocused && (
            <PlayButton
              className={styles.PlayButton}
              loading={loading}
              paused={paused}
              backgroundColor={"#E23E1D"}
              ariaLabel={label}
            />
          )}

          {!isFocused && <HabitatIcon className={styles.HabitatIcon} habitat={site.habitat} />}
        </div>
      </div>
    </ReactMarker>
  );
}

const mapStateToProps = (state: State, props: SiteMarkerProps) => {
  const isFocused = getFocusedSiteId(state) === props.site.id;

  return {
    isFocused,
    siteAudioState: getSiteAudio(state),
    focusedTimeSegment: getFocusedTimeSegment(state),
    siteAudioByTimeSegment: getSiteAudioByTimeSegment(state)
  };
};

const mapDispatchToProps = (dispatch: any, props: SiteMarkerProps) => {
  return {
    toggleAudio: () => {
      dispatch(toggleSiteAudioPlayState());
    }
  };
};

const SiteMarker = connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteMarkerView);

export default SiteMarker;
