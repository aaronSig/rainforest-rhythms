import { navigate } from "@reach/router";
import api from "../../api/api";
import { StreamInfo } from "../../api/types";
import { State } from "../reducers";
import { audioControlDecimalHour } from "../selectors/audio";
import { mapPaneFocusedSiteId } from "../selectors/maps";
import { ax, clearData, setError, setLoading, SET_LOADING } from "./actions";
import { loadTaxaInfo } from "./info";
import { focusSiteId } from "./map";

// Constructs the url to load
export const SET_AUDIO_FILE = "SET_AUDIO_FILE";
export function setAudioFile(
  audioId: string | number,
  timestamp: number = 0,
  streamInfo?: StreamInfo
) {
  return async (dispatch: any, getState: () => State) => {
    dispatch(
      ax(SET_AUDIO_FILE, {
        audioId,
        audioUrl: null,
        timestamp: 0
      })
    );
    dispatch(setLoading(true));

    try {
      let stream = streamInfo;
      if (!streamInfo) {
        const streamInfo = await api.streams.info(audioId);
        if (!streamInfo) {
          // error loading the stream.
          return;
        }
        stream = streamInfo;
      }
      // set the site ID for this sample
      dispatch(focusSiteId(stream!.site));

      const audioUrl = await api.streams.audioStream(stream!.box_id);
      if (!audioUrl) {
        setError("Unable to load audio stream url");
        return;
      }
      dispatch({
        type: SET_AUDIO_FILE,
        item: {
          audioId,
          audioUrl,
          timestamp,
          streamInfo: stream
        }
      });

      dispatch(loadTaxaInfo());
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export const UPDATE_AUDIO_CONTROL_PROGRESS = "UPDATE_AUDIO_CONTROL_PROGRESS";
export function updateAudioControlProgress(progress: number) {
  return {
    type: UPDATE_AUDIO_CONTROL_PROGRESS,
    item: {
      progress
    }
  };
}

export const COMMIT_AUDIO_CONTROL_PROGRESS = "COMMIT_AUDIO_CONTROL_PROGRESS";
export function commitAudioControlProgress() {
  return (dispatch: any, getState: () => State) => {
    /*
    Two states:
      1. The user has chosen a position in the currently loaded audio. Seek to that time.
      2. The position is outside the audio. Queue up the next stream.
    */

    // TODO how to check if we can seek to the position in the audio?

    dispatch(loadAudio());
  };
}

export const TOGGLE_AUDIO_PLAYBACK = "TOGGLE_AUDIO_PLAYBACK";
export function toggleAudioPlayback() {
  return ax(TOGGLE_AUDIO_PLAYBACK);
}

// Takes the currently set timestamp and site ID and searches for the next audio clip
// If the site ID isn't set will do nothing
export function loadAudio() {
  return async (dispatch: any, getState: () => State) => {
    dispatch(ax(SET_LOADING, { loading: true }));

    try {
      const state = getState();
      const siteId = mapPaneFocusedSiteId(state);
      if (!siteId) {
        return;
      }

      const time = audioControlDecimalHour(state);
      console.log("Searching for ", siteId, time);
      const result = await api.streams.search(siteId, time);
      console.log("result", result);
      if (!result) {
        return;
      }

      dispatch(clearData());
      navigate(`/${result.audio}`);

      // more efficitent but we lose the URL navigation
      // dispatch(setAudioFile(result.audio, 0, result));
    } finally {
      dispatch(ax(SET_LOADING, { loading: false }));
    }
  };
}
