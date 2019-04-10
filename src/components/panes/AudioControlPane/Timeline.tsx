import { Link } from "@reach/router";
import React from "react";
import { connect } from "react-redux";
import arrowDark from "../../../icons/arrow-dark.svg";
import { getNextAudioLink, getPreviousAudioLink } from "../../../state/selectors";
import { State } from "../../../state/types";
import styles from "./Timeline.module.css";
import Waveform from "./Waveform";

interface TimelineProps {
  previousAudioLink: string;
  nextAudioLink: string;
}

function TimelineView(props: TimelineProps) {
  return (
    <div className={styles.Timeline}>
      <Link to={props.previousAudioLink} aria-label="Previous audio">
        <img className={styles.left} src={arrowDark} alt="Left Arrow" />
      </Link>
      <Waveform />
      <Link to={props.nextAudioLink} aria-label="Next audio">
        <img src={arrowDark} alt="Right Arrow" />
      </Link>
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    previousAudioLink: getPreviousAudioLink(state),
    nextAudioLink: getNextAudioLink(state)
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
