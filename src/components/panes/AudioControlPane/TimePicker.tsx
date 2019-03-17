import { Link } from "@reach/router";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { StreamInfo } from "../../../api/types";
import moon from "../../../icons/moon.svg";
import sun from "../../../icons/sun.svg";
import { toggleSiteAudioPlayState } from "../../../state/actions";
import {
  getFocusedSiteId,
  getFocusedTimeSegment,
  getSiteAudio,
  getSiteAudioByTimeSegment,
  getSunrise,
  getSunset
} from "../../../state/selectors";
import { allTimeSegments, SiteAudioState, State, TimeSegment } from "../../../state/types";
import PlayButton from "../../buttons/play/PlayButton";
import styles from "./TimePicker.module.css";

interface TimePickerProps {
  sunrise: TimeSegment;
  sunset: TimeSegment;
  focusedSiteId: string | null;
  focusedTimeSegment: TimeSegment;
  timeSegments: TimeSegment[];
  siteAudioByTimeSegment: { [siteId: string]: { [time in TimeSegment]: StreamInfo[] } };
  siteAudioInfo: SiteAudioState;

  toggleSiteAudioPlaying: () => void;
}

function TimePickerView(props: TimePickerProps) {
  const { focusedSiteId, focusedTimeSegment, siteAudioByTimeSegment, siteAudioInfo } = props;

  function urlFor(t: TimeSegment) {
    const parts = [t] as string[];
    if (focusedSiteId) {
      parts.push(focusedSiteId);
      if (focusedSiteId in siteAudioByTimeSegment) {
        const audio = siteAudioByTimeSegment[focusedSiteId][t];
        if (audio.length) {
          parts.push(audio[0].audio);
        }
      }
    }
    return "/" + parts.join("/");
  }

  function togglePlay() {
    props.toggleSiteAudioPlaying();
  }

  return (
    <ul className={styles.TimePicker}>
      <li className={styles.dud} />
      {props.timeSegments.map(t => {
        const active = focusedTimeSegment === t ? styles.active : undefined;
        let icon = null as ReactElement | null;
        if (props.sunrise === t) {
          icon = <img src={sun} alt="Sunrise" />;
        } else if (props.sunset === t) {
          icon = <img src={moon} alt="Sunset" />;
        }

        if (active) {
          const loadingStyle = !siteAudioInfo.isReady ? styles.loading : undefined;
          return (
            <li key={t} className={active}>
              <PlayButton
                className={loadingStyle}
                onClick={togglePlay}
                paused={!siteAudioInfo.isPlaying}
                loading={!siteAudioInfo.isReady}
                backgroundColor={"#fff"}
                foregroundColor={"#002f2a"}
              />
              <span>{t}</span>
            </li>
          );
        }

        return (
          <li key={t}>
            <Link to={urlFor(t)}>
              <div className={styles.icon}>{icon}</div>
              <span>{t}</span>
              <div className={styles.indicator} />
            </Link>
          </li>
        );
      })}
      <li className={styles.dud} />
    </ul>
  );
}

const mapStateToProps = (state: State) => {
  return {
    sunrise: getSunrise(state),
    sunset: getSunset(state),
    focusedTimeSegment: getFocusedTimeSegment(state),
    focusedSiteId: getFocusedSiteId(state),
    siteAudioInfo: getSiteAudio(state),
    timeSegments: allTimeSegments,
    siteAudioByTimeSegment: getSiteAudioByTimeSegment(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleSiteAudioPlaying: () => {
      dispatch(toggleSiteAudioPlayState());
    }
  };
};

const TimePicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimePickerView);

export default TimePicker;
