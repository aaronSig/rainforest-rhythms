import { AnyAction } from "redux";

export interface AudioState {
  // The actual timestamp of the playing audio
  timestamp: null | number;
}

const initialState: AudioState = {
  timestamp: null
};

export default function audioReducer(state: AudioState = initialState, action: AnyAction) {
  switch (action.type) {
    default:
      return state;
  }
}
