import React from "react";
import { connect } from "react-redux";
import arrowDark from "../../../icons/arrow-dark.svg";
import { State } from "../../../state/types";
import styles from "./Timeline.module.css";
import Waveform from "./Waveform";

interface TimelineProps {}

function TimelineView(props: TimelineProps) {
  return (
    <div className={styles.Timeline}>
      <button type="button">
        <img className={styles.left} src={arrowDark} alt="Left Arrow" />
      </button>
      <Waveform />
      <button type="button">
        <img src={arrowDark} alt="Right Arrow" />
      </button>
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const Timeline = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineView);

export default Timeline;
