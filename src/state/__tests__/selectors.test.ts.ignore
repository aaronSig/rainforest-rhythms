import { StreamInfo } from "../../api/types";
import { getSiteAudioByTimeSegment } from "../selectors";
import { allTimeSegments } from "../types";
import { standardState } from "./fixtures";

test("Can buid audio by time segments", () => {
  const sabts = getSiteAudioByTimeSegment(standardState);
  const site1 = sabts[1];
  const site2 = sabts[2];
  const site3 = sabts[3];

  const justIds = (item: StreamInfo) => item.audio;

  expect(site1["10:00"].map(justIds)).toEqual(["3086"]);
  expect(site1["22:00"].map(justIds)).toEqual(["9288"]);
  allTimeSegments
    .filter(t => !(t === "10:00" || t === "22:00"))
    .forEach(t => {
      expect(site1[t]).toEqual([]);
    });

  expect(site2["08:00"].map(justIds)).toEqual(["20132"]);
  expect(site3["18:00"].map(justIds)).toEqual(["20683"]);
});
