import { Set } from "immutable";
import { getTaxaForFocusedSite, getTaxaForFocusedSiteAtCurrentTime } from "../selectors";
import { createTestState } from "./fixtures";

test("Can fetch the taxa for focused site", () => {
  const state = createTestState({ focusedSiteId: "1" });
  const taxa = getTaxaForFocusedSite(state);
  expect(taxa).toEqual(Set([state.taxaById.get("1"), state.taxaById.get("2")]));
});

test("Empty array if no site is focused", () => {
  const state = createTestState({ focusedSiteId: null });
  const taxa = getTaxaForFocusedSite(state);
  expect(taxa).toEqual([]);
});

test("Can fetch the taxa for focused site at time", () => {
  const state = createTestState({ focusedSiteId: "1", focusedTimeSegment: "10:00" });
  const taxa = getTaxaForFocusedSiteAtCurrentTime(state);
  expect(taxa).toEqual(Set([state.taxaById.get("1")]));
});

test("Empty array if no time set", () => {
  const state = createTestState({ focusedSiteId: "1", focusedTimeSegment: null });
  const taxa = getTaxaForFocusedSiteAtCurrentTime(state);
  expect(taxa).toEqual([]);
});
