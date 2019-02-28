import { AnyAction } from "redux";
import { UPDATE_AUDIO_CONTROL_PROGRESS } from "../../actions";

export interface AudioControlState {
  // The progress (between 0 => 1) of the progress bar
  progress: number;
}

export const audioControlInitialState: AudioControlState = {
  progress: 0
};

export default function audioControlReducer(
  state: AudioControlState = audioControlInitialState,
  action: AnyAction
) {
  switch (action.type) {
    case UPDATE_AUDIO_CONTROL_PROGRESS:
      return Object.assign({}, state, action.item);
    default:
      return state;
  }
}
