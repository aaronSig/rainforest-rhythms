import { format } from "date-fns";
import { AnyAction } from "redux";
import { UPDATE_AUDIO_CONTROL_PROGRESS } from "../../actions/audio";

const millisInDay = 86400000;

export interface AudioControlState {
  // The progress (between 0 => 1) of the progress bar
  progress: number;
  time: string; // formatted time of day
  decimalHour: number; // Used for looking up the stream where the time is expected as decimal hour [0.0 - 23.99]
}

export const audioControlInitialState: AudioControlState = {
  progress: 0.5,
  time: "12:00:00:00",
  decimalHour: 12.0
};

export default function audioControlReducer(
  state: AudioControlState = audioControlInitialState,
  action: AnyAction
) {
  switch (action.type) {
    case UPDATE_AUDIO_CONTROL_PROGRESS:
      const d = new Date(action.item.progress * millisInDay);
      const time = format(d, "HH:mm:ss:SSS");
      const h = format(d, "HH");
      const m = Math.round((parseInt(format(d, "mm")) / 59) * 100);
      const decimalHour = parseFloat(`${h}.${m}`);
      return Object.assign({}, state, action.item, { time, decimalHour });
    default:
      return state;
  }
}
