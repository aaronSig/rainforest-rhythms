import { Dispatch } from "redux";
import api from "../../api/api";
import { State } from "../reducers";
import { loadingCount } from "../selectors/global";
import { setAudioFile } from "./audio";
import { focusSiteId, setGeoJson, setSites } from "./map";

// shorthand action factory.
export function ax(type: string, item?: any) {
  return {
    type,
    item
  };
}

export const SET_LOADING = "SET_LOADING";
export function setLoading(loading: boolean) {
  return (dispatch: Dispatch, getState: () => State) => {
    // many requests could be loading at a time
    // this will change to false when they've all completed
    let count = loadingCount(getState());
    if (loading) {
      count = count + 1;
    } else {
      count = Math.max(0, count - 1);
    }
    dispatch(ax(SET_LOADING, { loading: count }));
  };
}

export const SET_ERROR = "SET_ERROR";
export function setError(error: string) {
  return ax(SET_ERROR, { error });
}

// fired when the app is mounted. If the user has added params to the url they're loaded here
export function loadInitialData(audioId?: string, timestamp?: number) {
  return async (dispatch: any) => {
    dispatch(setLoading(true));

    try {
      // load map features & sites
      const [habitats, streams, sites] = await Promise.all([
        api.geoJson.habitats(),
        api.geoJson.streams(),
        api.sites.list()
      ]);
      dispatch(setGeoJson(habitats, streams));
      dispatch(setSites(sites));

      if (audioId) {
        // This will set the audio loading and fill in the site info
        dispatch(setAudioFile(audioId, timestamp));
      } else {
        // select the first site
        if (sites.length) {
          dispatch(focusSiteId(sites[0].id));
        }
      }
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export const CLEAR_DATA = "CLEAR_DATA";
export function clearData() {
  return ax(CLEAR_DATA);
}
