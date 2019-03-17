import { Link } from "@reach/router";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { StreamInfo } from "../../../api/types";
import moon from "../../../icons/moon.svg";
import play from "../../../icons/play.svg";
import sun from "../../../icons/sun.svg";
import { toggleSiteAudioPlayState } from "../../../state/actions";
import {
  getFocusedSiteId,
  getFocusedTimeSegment,
  getSiteAudioByTimeSegment,
  getSunrise,
  getSunset
} from "../../../state/selectors";
import { allTimeSegments, State, TimeSegment } from "../../../state/types";
import styles from "./TimePicker.module.css";

interface TimePickerProps {
  sunrise: TimeSegment;
  sunset: TimeSegment;
  focusedSiteId: string | null;
  focusedTimeSegment: TimeSegment;
  timeSegments: TimeSegment[];
  siteAudioByTimeSegment: { [siteId: string]: { [time in TimeSegment]: StreamInfo[] } };

  toggleSiteAudioPlaying: () => void;
}

function TimePickerView(props: TimePickerProps) {
  const { focusedSiteId, focusedTimeSegment, siteAudioByTimeSegment } = props;

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
          icon = <img src={play} alt="Play" />;

          return (
            <li key={t} className={active}>
              <button type="button" onClick={togglePlay}>
                <div className={styles.icon}>{icon}</div>
                <span>{t}</span>
                <div className={styles.indicator} />
              </button>
            </li>
          );
        }

        return (
          <li key={t} className={active}>
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
