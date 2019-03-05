import { TimeSegment } from "../state/types";

// works out the closest TimeSegment from a time in the format HH:mm:ss
export function getTimeSegment(time: string): TimeSegment {
  let [hours, minutes] = time.split(":").map(p => parseInt(p));
  if (minutes > 29) {
    hours = hours + 1;
    if (hours > 23) {
      hours = 0;
    }
  }
  return `${`${hours}`.padStart(2, "0")}:00` as TimeSegment;
}
