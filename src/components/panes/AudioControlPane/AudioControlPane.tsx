import React from "react";
import { connect } from "react-redux";
import { State } from "../../../state/types";
import styles from "./AudioControlPane.module.css";
import Timeline from "./Timeline";
import TimePicker from "./TimePicker";

interface AudioControlPaneProps {}

/***
 * Responsible for trigging fetching the audio when a new site/time is selected
 */
function AudioControlPaneView(props: AudioControlPaneProps) {
  return (
    <section className={styles.AudioControlPane}>
      <TimePicker />
      <Timeline />
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const AudioControlPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioControlPaneView);

export default AudioControlPane;
