import { State } from "../reducers";

export const currentTimestamp = (state: State) => state.audio.timestamp;
export const audioIsPlaying = (state: State) => state.audio.isPlaying;
export const getAudioId = (state: State) => state.audio.audioId;
export const getAudioStreamURL = (state: State) => state.audio.audioUrl;

export const audioControlProgress = (state: State) => state.ui.audioControl.progress;
export const audioControlTime = (state: State) => state.ui.audioControl.time;
export const audioControlDecimalHour = (state: State) => state.ui.audioControl.decimalHour;
