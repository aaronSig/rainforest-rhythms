import { Map } from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Site, StreamInfo } from "../../api/types";
import { routeDidChange } from "../../state/actions";
import { initialLoad, loadAudioInfo, searchForAudio } from "../../state/data-actions";
import {
  getAudioForFocusedSiteAtCurrentTime,
  getCurrentSiteAudioId,
  getSitesById
} from "../../state/selectors";
import { State, TimeSegment } from "../../state/types";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import AudioControlPane from "../panes/AudioControlPane/AudioControlPane";
import InfoPane from "../panes/InfoPane/InfoPane";
import MapPane from "../panes/MapPane/MapPane";
import withTimestamp from "../withTimestamp";
import styles from "./Index.module.css";
import useIndexHook from "./indexHooks";

export interface IndexProps {
  // the path used by the router
  path: string;
  timeSegment: TimeSegment;
  siteId: string | undefined;
  // The specific audio to play
  audioId?: string;
  // time to seek to in the audio
  timestamp?: number;
  // Audio available for the current site and time
  availableAudio: StreamInfo[];
  currentSiteAudioId: string | null;
  sitesById: Map<string, Site>;

  initialLoad: () => void;
  updateTimeAndSite: (timeSegment: TimeSegment, siteId?: string) => void;
  loadAudio: (audioId?: string, timestamp?: number) => void;

  searchForAudio: (siteId: string, time: TimeSegment) => void;
}

// The flow for selecting audio
//  -> trigger navigation. Set audio id as the param
//  -> check to see if we have the audio stream info and load if not
//  -> ensure the correct TimeSegment and site are selected
//  -> auto play the audio?

export function IndexView(props: IndexProps) {
  useIndexHook(props);

  return (
    <div className={styles.Home}>
      <LoadingIndicator />
      <div className="row">
        <MapPane />
        <InfoPane />
      </div>
      <AudioControlPane />
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    currentSiteAudioId: getCurrentSiteAudioId(state),
    availableAudio: getAudioForFocusedSiteAtCurrentTime(state),
    sitesById: getSitesById(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    initialLoad: () => {
      // Fetches the map features and info about the sites
      dispatch(initialLoad());
    },
    updateTimeAndSite: (timeSegment: TimeSegment, siteId?: string) => {
      dispatch(routeDidChange(timeSegment, siteId));
    },
    loadAudio: (audioId?: string, timestamp?: number) => {
      if (audioId !== undefined) {
        dispatch(loadAudioInfo(audioId, timestamp));
      }
    },
    searchForAudio: (siteId: string, time: TimeSegment) => {
      dispatch(searchForAudio(siteId, time));
    }
  };
};

const Index = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTimestamp(IndexView));

export default Index;
