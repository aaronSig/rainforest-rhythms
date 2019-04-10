import { Link } from "@reach/router";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { interpolate } from "react-spring";
import { StreamInfo, TimeSegment } from "../../../api/types";
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
import { allTimeSegments, SiteAudioState, State } from "../../../state/types";
import { sortClosestToTime } from "../../../utils/dates";
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
          const sortedAudio = sortClosestToTime(audio, t);
          parts.push(sortedAudio[0].audio);
        }
      }
    }
    return "/" + parts.join("/");
  }

  function togglePlay() {
    props.toggleSiteAudioPlaying();
  }

  // interpolate the background colour depending on the time
  //  #002f2a; #003832;  lightest -> darkest
  const inter: any = interpolate([1], c => c).interpolate(
    [-5, 12, 28],
    ["#002f2a", "#007E72", "#002f2a"]
  );

  return (
    <ul className={styles.TimePicker}>
      <li className={styles.dud} />
      {props.timeSegments.map(t => {
        const active = focusedTimeSegment === t ? styles.active : undefined;
        let icon = null as ReactElement | null;
        if (props.sunrise === t) {
          icon = <img src={sun} alt="Sunrise" title="Sunrise" />;
        } else if (props.sunset === t) {
          icon = <img src={moon} alt="Sunset" title="Sunset" />;
        }

        if (active) {
          const loadingStyle = !siteAudioInfo.isReady ? styles.loading : undefined;
          let label = `Play`;
          if (!siteAudioInfo.isReady) {
            label = `Loading`;
          } else if (siteAudioInfo.isPlaying) {
            label = `Pause`;
          }
          return (
            <li key={t} className={active}>
              <PlayButton
                ariaLabel={label}
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

        const backgroundColor = inter.calc(parseInt(t));
        return (
          <li key={t} style={{ backgroundColor }}>
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
