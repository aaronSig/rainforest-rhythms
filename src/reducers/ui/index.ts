import { combineReducers } from "redux";
import audioControl, { AudioControlState } from "./audio-control";

export interface UiState {
  audioControl: AudioControlState;
}

export default combineReducers({
  audioControl
});
