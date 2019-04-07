import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { animated, useTransition } from "react-spring";
import { TimeSegment } from "../../../../api/types";
import moon from "../../../../icons/moon.svg";
import sun from "../../../../icons/sun.svg";
import { getSunrise, getSunset } from "../../../../state/selectors";
import { allTimeSegments, State } from "../../../../state/types";
import usePrevious from "../../../../utils/usePrevious";
import styles from "./DayIndicator.module.css";

interface DayIndicatorProps {
  timeSegment: TimeSegment;
  sunrise: TimeSegment;
  sunset: TimeSegment;
}

function DayIndicator(props: DayIndicatorProps) {
  const { timeSegment, sunrise, sunset } = props;
  const daylightHours = useMemo(() => daylightMap(sunrise, sunset, allTimeSegments), [
    sunrise,
    sunset
  ]);

  const [isDaylight, setDaylight] = useState(true);
  const wasDaylight = usePrevious(isDaylight, true);

  useEffect(() => {
    setDaylight(daylightHours[timeSegment]);
  }, [daylightHours, timeSegment]);

  const day = <img src={sun} alt="Day time" />;
  const night = <img src={moon} alt="Night time" />;
  const icon = isDaylight ? day : night;

  const dayToNight = wasDaylight && !isDaylight;
  const y = dayToNight ? 100 : -100;
  const transitions = useTransition(icon, `${isDaylight}`, {
    from: { opacity: 1, transform: `translate3d(0,${y * -1}%,0)` },
    enter: { opacity: 1, transform: `translate3d(0,0,0)` },
    leave: { opacity: 1, transform: `translate3d(0,${y},0)` }
  });

  return (
    <div className={styles.DayIndicator}>
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
          {item}
        </animated.div>
      ))}
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    sunrise: getSunrise(state),
    sunset: getSunset(state)
  };
};

export default connect(mapStateToProps)(DayIndicator);

// A map with true for each timesegment key that has daylight
function daylightMap(
  sunrise: TimeSegment,
  sunset: TimeSegment,
  allTimeSegments: TimeSegment[]
): { [key in TimeSegment]: boolean } {
  const sunriseIndex = allTimeSegments.indexOf(sunrise);
  const sunsetIndex = allTimeSegments.indexOf(sunset);
  return allTimeSegments.reduce(
    (acc, curr, index) => {
      if (sunriseIndex - 1 < index && index < sunsetIndex) {
        acc[curr] = true;
      } else {
        acc[curr] = false;
      }
      return acc;
    },
    {} as { [key in TimeSegment]: boolean }
  );
}
