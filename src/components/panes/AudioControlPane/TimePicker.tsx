import React, { ReactElement } from "react";
import { connect } from "react-redux";
import moon from "../../../icons/moon.svg";
import play from "../../../icons/play.svg";
import sun from "../../../icons/sun.svg";
import { focusTimeSegment } from "../../../state/actions";
import { getFocusedTimeSegment, getSunrise, getSunset } from "../../../state/selectors";
import { allTimeSegments, State, TimeSegment } from "../../../state/types";
import styles from "./TimePicker.module.css";

interface TimePickerProps {
  sunrise: TimeSegment;
  sunset: TimeSegment;
  focusedTimeSegment: TimeSegment;
  timeSegments: TimeSegment[];

  focusTimeSegment: (timeSegment: TimeSegment) => void;
}

function TimePickerView(props: TimePickerProps) {
  return (
    <ul className={styles.TimePicker}>
      {props.timeSegments.map(t => {
        const active = props.focusedTimeSegment === t ? styles.active : undefined;
        let icon = null as ReactElement | null;
        if (props.sunrise === t) {
          icon = <img src={sun} alt="Sunrise" />;
        } else if (props.sunset === t) {
          icon = <img src={moon} alt="Sunset" />;
        }

        if (active) {
          icon = <img src={play} alt="Play" />;
        }

        function focusTimeSegment() {
          if (!active) {
            props.focusTimeSegment(t);
          }
        }
        return (
          <li key={t} className={active} onClick={focusTimeSegment}>
            <div className={styles.icon}>{icon}</div>
            <span>{t}</span>
            <div className={styles.indicator} />
          </li>
        );
      })}
    </ul>
  );
}

const mapStateToProps = (state: State) => {
  return {
    sunrise: getSunrise(state),
    sunset: getSunset(state),
    focusedTimeSegment: getFocusedTimeSegment(state),
    timeSegments: allTimeSegments
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    focusTimeSegment: (timeSegment: TimeSegment) => {
      dispatch(focusTimeSegment(timeSegment));
    }
  };
};

const TimePicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimePickerView);

export default TimePicker;
