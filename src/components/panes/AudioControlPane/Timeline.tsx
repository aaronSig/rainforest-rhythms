import { Link } from "@reach/router";
import React from "react";
import { connect } from "react-redux";
import { TimeSegment } from "../../../api/types";
import arrowDark from "../../../icons/arrow-dark.svg";
import { getFocusedSiteId, getFocusedTimeSegment } from "../../../state/selectors";
import { allTimeSegments, State } from "../../../state/types";
import styles from "./Timeline.module.css";
import Waveform from "./Waveform";

interface TimelineProps {
  focusedSiteId: string | null;
  focusedTimesegment: TimeSegment;
}

function TimelineView(props: TimelineProps) {
  const index = allTimeSegments.findIndex(t => t === props.focusedTimesegment);

  const beforeIndex = (allTimeSegments.length + index - 1) % allTimeSegments.length;
  const afterIndex = (allTimeSegments.length + index + 1) % allTimeSegments.length;

  const previouseTimeSegment = allTimeSegments[beforeIndex];
  const nextTimeSegment = allTimeSegments[afterIndex];

  const focusedSiteId = props.focusedSiteId || "";

  return (
    <div className={styles.Timeline}>
      <Link to={`/${previouseTimeSegment}/${focusedSiteId}`} aria-label="Previous audio">
        <img className={styles.left} src={arrowDark} alt="Left Arrow" />
      </Link>
      <Waveform />
      <Link to={`/${nextTimeSegment}/${focusedSiteId}`} aria-label="Next audio">
        <img src={arrowDark} alt="Right Arrow" />
      </Link>
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    focusedSiteId: getFocusedSiteId(state),
    focusedTimesegment: getFocusedTimeSegment(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const Timeline = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineView);

export default Timeline;
