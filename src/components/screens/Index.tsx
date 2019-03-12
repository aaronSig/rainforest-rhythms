import React, { useEffect } from "react";
import { connect } from "react-redux";
import { initialLoad, loadAudioInfo } from "../../state/data-actions";
import { State } from "../../state/types";
import useSize from "../../utils/useSize";
import { AudioControlPane } from "../panes/AudioControlPane/AudioControlPane";
import InfoPane from "../panes/InfoPane/InfoPane";
import MapPane from "../panes/MapPane/MapPane";
import withTimestamp from "../withTimestamp";
import styles from "./Index.module.css";

export interface IndexProps {
  // the path used by the router
  path: string;
  // The specific audio to play
  audioId?: string;
  // time to seek to in the audio
  timestamp?: number;

  initialLoad: () => void;
  loadAudio: (audioId?: string, timestamp?: number) => void;
}

// The flow for selecting audio
//  -> trigger navigation. Set audio id as the param
//  -> check to see if we have the audio stream info and load if not
//  -> ensure the correct TimeSegment and site are selected
//  -> auto play the audio?

export function IndexView(props: IndexProps) {
  const [ref, rowSize] = useSize();

  useEffect(() => {
    props.initialLoad();
  }, []);

  useEffect(() => {
    props.loadAudio(props.audioId, props.timestamp);
  }, [props.audioId, props.timestamp]);

  return (
    <div className={styles.Home}>
      <div className="row" ref={ref}>
        <MapPane width={rowSize.width * 0.67} height={rowSize.height} />
        <InfoPane />
      </div>
      <AudioControlPane />
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    initialLoad: () => {
      // Fetches the map features and info about the sites
      dispatch(initialLoad());
    },
    loadAudio: (audioId?: string, timestamp?: number) => {
      if (audioId !== undefined) {
        dispatch(loadAudioInfo(audioId, timestamp));
      }
    }
  };
};

const Index = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTimestamp(IndexView));

export default Index;
