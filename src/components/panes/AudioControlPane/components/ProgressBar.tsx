import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateAudioControlProgress } from "../../../../actions";
import { State } from "../../../../reducers";
import { audioControlProgress } from "../../../../seletors";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  progress: number; // between 0 -> 1
  changeProgress: (progress: number) => void;
  commitProgressChange: () => void; // when the user has let go of the scrubber
}

const MAX = (24 * 60) / 20; // 72 20 min chunks in a day

/***
 * The progress bar should update when sound is playing BUT
 * the mouse position should override changing the value when dragging.
 *
 * When the drag has ended an event should fire to update the now playing position
 */

function ProgressBarView(props: ProgressBarProps) {
  function didUpdateSlider(e: ChangeEvent<HTMLInputElement>) {
    props.changeProgress(e.target.valueAsNumber / MAX);
  }

  return (
    <div className={styles.ProgressBar}>
      <input
        className={styles.Slider}
        type="range"
        min="0"
        max={MAX}
        step={1}
        value={props.progress * MAX}
        onMouseUp={props.commitProgressChange}
        onChange={didUpdateSlider}
      />
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    progress: audioControlProgress(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changeProgress: (progress: number) => {
      dispatch(updateAudioControlProgress(progress));
    },
    commitProgressChange: () => {}
  };
};

const ProgressBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressBarView);

export default ProgressBar;
