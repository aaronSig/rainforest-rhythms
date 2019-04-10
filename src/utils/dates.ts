import { addDays, differenceInMilliseconds, parse } from "date-fns";
import { StreamInfo, TimeSegment } from "../api/types";

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

/***
 * Sorts the audio array bringing the audio closest to
 * the timesegment to the top
 */
export function sortClosestToTime(audio: StreamInfo[], t: TimeSegment): StreamInfo[] {
  const segmentDateTime = parse(t, "HH:mm", new Date());

  const sortedAudio = ([] as StreamInfo[]).concat(audio);
  sortedAudio.sort((a, b) => {
    const aTime = parse(
      a.time,
      "HH:mm:ss",
      t === "00:00" && parseInt(a.time) === 0 ? addDays(segmentDateTime, 1) : segmentDateTime
    );
    const bTime = parse(
      b.time,
      "HH:mm:ss",
      t === "00:00" && parseInt(a.time) === 0 ? addDays(segmentDateTime, 1) : segmentDateTime
    );

    const aDiff = Math.abs(differenceInMilliseconds(aTime, segmentDateTime));
    const bDiff = Math.abs(differenceInMilliseconds(bTime, segmentDateTime));

    return aDiff < bDiff ? -1 : 1;
  });

  return sortedAudio;
}
