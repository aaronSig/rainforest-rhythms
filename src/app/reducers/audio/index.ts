import { AnyAction } from "redux";
import { StreamInfo } from "../../../api/types";
import { CLEAR_DATA } from "../../actions/actions";
import { SET_AUDIO_FILE, TOGGLE_AUDIO_PLAYBACK } from "../../actions/audio";

export interface AudioState {
  // the file ID to play
  audioId: string | null;
  audioUrl: string | null;
  streamInfo: StreamInfo | null;

  // The actual timestamp of the playing audio. In seconds
  timestamp: null | number;
  isPlaying: boolean;
}

const initialState: AudioState = {
  audioId: null,
  audioUrl: null,
  timestamp: null,
  isPlaying: false,
  streamInfo: null
};

export default function audioReducer(state: AudioState = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_AUDIO_FILE:
      return Object.assign({}, state, action.item);
    case TOGGLE_AUDIO_PLAYBACK:
      return Object.assign({}, state, { isPlaying: !state.isPlaying });
    case CLEAR_DATA:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
}
