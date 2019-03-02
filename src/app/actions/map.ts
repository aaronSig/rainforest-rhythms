import { Site } from "../../api/types";
import { State } from "../reducers";
import { mapPaneFocusedSiteId } from "../selectors/maps";
import { ax } from "./actions";
import { loadAudio } from "./audio";

export const SET_GEO_JSON = "SET_GEO_JSON";
export function setGeoJson(habitatData: GeoJSON.GeoJsonObject, streamData: GeoJSON.GeoJsonObject) {
  return ax(SET_GEO_JSON, { habitatData, streamData });
}

export const SET_SITES = "SET_SITES";
export function setSites(sites: Site[]) {
  return ax(SET_SITES, { sites });
}

export const FOCUS_SITE_ID = "FOCUS_SITE_ID";
export function focusSiteId(focusedSiteId: number) {
  return async (dispatch: any, getState: () => State) => {
    const state = getState();
    const prevSiteId = mapPaneFocusedSiteId(state);
    dispatch(ax(FOCUS_SITE_ID, { focusedSiteId }));

    // If we've clicked on a new site then laod the audio for that
    if (prevSiteId !== focusedSiteId) {
      dispatch(loadAudio());
    }
  };
}
