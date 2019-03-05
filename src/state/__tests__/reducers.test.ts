import { GeoJsonObject } from "geojson";
import { createStore } from "redux";
import {
  focusSiteId,
  focusTaxonId,
  focusTimeSegment,
  setCurrentSiteAudio,
  setPreloadedData
} from "../actions";
import reducer from "../reducers";
import { standardState } from "./fixtures";

let store = createStore(reducer);

beforeEach(() => {
  store = createStore(reducer);
});

test("Correctly set preloaded data", () => {
  const habitatData: GeoJsonObject = { type: "Feature", bbox: [12, 12, 12, 12] };
  const streamData: GeoJsonObject = { type: "Feature", bbox: [1, 2, 1, 2] };
  const sitesById = standardState.sitesById;

  store.dispatch(setPreloadedData(habitatData, streamData, sitesById));

  const state = store.getState();
  expect(state.habitatData).toBe(habitatData);
  expect(state.streamData).toBe(streamData);
  expect(state.sitesById).toBe(sitesById);
});

test("Correctly focus site ID", () => {
  store.dispatch(focusSiteId("101"));
  const state = store.getState();
  expect(state.focusedSiteId).toBe("101");
});

test("Correctly focus time segment", () => {
  store.dispatch(focusTimeSegment("23:00"));
  const state = store.getState();
  expect(state.focusedTimeSegment).toBe("23:00");
});

test("Correctly focus Taxon ID", () => {
  store.dispatch(focusTaxonId("99"));
  const state = store.getState();
  expect(state.focusedTaxonId).toBe("99");
});

test("Correctly set site current audio", () => {
  store.dispatch(setCurrentSiteAudio("65"));
  const state = store.getState();
  expect(state.currentSiteAudioId).toBe("65");
});
