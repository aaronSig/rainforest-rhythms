import { combineReducers } from "redux";
import audio, { AudioState } from "./audio";
import ui, { UiState } from "./ui";

export interface State {
  audio: AudioState;
  ui: UiState;
}

export default combineReducers({
  audio,
  ui
});
