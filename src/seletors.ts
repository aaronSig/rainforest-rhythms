import { State } from "./reducers";

export const currentTimestamp = (state: State) => state.audio.timestamp;
export const audioControlProgress = (state: State) => state.ui.audioControl.progress;
