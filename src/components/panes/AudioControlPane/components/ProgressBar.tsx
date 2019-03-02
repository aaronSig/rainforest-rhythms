import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import {
  commitAudioControlProgress,
  updateAudioControlProgress
} from "../../../../app/actions/audio";
import { State } from "../../../../app/reducers";
import { audioControlProgress } from "../../../../app/selectors/audio";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  progress: number; // between 0 -> 1
  changeProgress: (progress: number) => void;
  commitProgressChange: () => void; // when the user has let go of the scrubber
}

const MAX = 86400000; //(24 * 60) / 20; // 72 20 min chunks in a day

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

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeProgress: (progress: number) => {
      dispatch(updateAudioControlProgress(progress));
    },
    commitProgressChange: () => {
      dispatch(commitAudioControlProgress());
    }
  };
};

const ProgressBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressBarView);

export default ProgressBar;
