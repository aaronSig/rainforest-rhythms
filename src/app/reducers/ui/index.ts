import { combineReducers } from "redux";
import audioControl, { AudioControlState } from "./audio-control";
import global, { GlobalUIState } from "./global";
import infoPane, { InfoPaneState } from "./info-pane";
import mapPane, { MapPaneState } from "./map-pane";

export interface UiState {
  global: GlobalUIState;
  audioControl: AudioControlState;
  mapPane: MapPaneState;
  infoPane: InfoPaneState;
}

export default combineReducers({
  global,
  audioControl,
  mapPane,
  infoPane
});
