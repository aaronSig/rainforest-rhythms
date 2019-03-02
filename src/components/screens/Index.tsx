import React, { useEffect } from "react";
import { connect } from "react-redux";
import { clearData, loadInitialData } from "../../app/actions/actions";
import { State } from "../../app/reducers";
import useSize from "../../utils/useSize";
import AudioPlayer from "../AudioPlayer";
import { Navigation } from "../Navigation/Navigation";
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

  loadData: (audioId?: string, timestamp?: number) => void;
  clearData: () => void;
}

export function IndexView(props: IndexProps) {
  const [ref, rowSize] = useSize();

  useEffect(() => {
    props.loadData(props.audioId, props.timestamp);
    return () => {
      // Clean out stale data now the params have altered
      props.clearData();
    };
  }, [props.audioId, props.timestamp]);

  return (
    <div className={styles.Home}>
      <Navigation />
      <div className="row" ref={ref}>
        <MapPane width={rowSize.width * 0.67} height={rowSize.height} />
        <InfoPane />
      </div>
      <AudioControlPane />
      <AudioPlayer />
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadData: (audioId?: string, timestamp?: number) => {
      dispatch(loadInitialData(audioId, timestamp));
    },
    clearData: () => {
      dispatch(clearData());
    }
  };
};

const Index = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTimestamp(IndexView));

export default Index;
