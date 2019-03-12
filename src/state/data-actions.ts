import { Map } from "immutable";
import api from "../api/api";
import { Site, Taxon } from "../api/types";
import { getTimeSegment } from "../utils/dates";
import { byNumberKey } from "../utils/objects";
import {
  addSiteAudioInfo,
  focusSiteId,
  focusTimeSegment,
  seekToTime,
  setCurrentSiteAudio,
  setPreloadedData,
  setTaxaById,
  setTaxaBySite,
  setTaxaBySiteByTime
} from "./actions";
import {
  getCurrentSiteAudioId,
  getFocusedSiteId,
  getFocusedTimeSegment,
  getSiteAudioByAudioId,
  getSiteAudioByTimeSegment
} from "./selectors";
import { State, TimeSegment } from "./types";

// these are actions / thunks that use the server to load in data

// Go get all the stuff we need to layout the page
export function initialLoad() {
  return async (dispatch: any) => {
    const [habitats, streams, sites] = await Promise.all([
      api.geoJson.habitats(),
      api.geoJson.streams(),
      api.sites.list()
    ]);
    const sitesById = {} as { [key: string]: Site };
    for (const site of sites) {
      sitesById[site.id] = site;
    }
    dispatch(setPreloadedData(habitats, streams, Map(sitesById)));
    if (sites.length) {
      dispatch(focusSiteId(sites[0].id));
    }
  };
}

export function loadTaxaForSite(siteId: string, time: TimeSegment | null = null) {
  return async (dispatch: any) => {
    let result: Taxon[];
    if (time !== null) {
      // this works as TimeSegment are round hours
      const decimalTime = parseInt(time);
      result = await api.taxa.get(siteId, decimalTime);
    } else {
      result = await api.taxa.get(siteId);
    }

    // reduce the taxa into a map with the id as it's key
    const taxaById = byNumberKey("id", result);
    dispatch(setTaxaById(taxaById));

    // set the taxaIdBySiteId
    const taxaIds = Object.keys(taxaById);
    dispatch(setTaxaBySite(siteId, taxaIds));

    if (time !== null) {
      dispatch(setTaxaBySiteByTime(siteId, time, taxaIds));
    }
  };
}

/****
 * Loads a specifc piece of audio, setting the site, time and optionally the timestamp
 */
export function loadAudioInfo(audioId: string, timestamp?: number) {
  return async (dispatch: any, getState: () => State) => {
    let state = getState();
    let audioById = getSiteAudioByAudioId(state);
    let streamInfo = audioById.get(audioId);
    if (!audioById.has(audioId)) {
      const result = await api.streams.info(audioId);
      if (!result) {
        console.error("Unable to find audio", audioId);
        return;
      }
      dispatch(addSiteAudioInfo(result));
      streamInfo = result;
    }

    const focusedSiteId = getFocusedSiteId(state);
    if (focusedSiteId !== streamInfo!.site) {
      dispatch(focusSiteId(streamInfo!.site));
    }

    const focusedTimeSegment = getFocusedTimeSegment(state);
    const streamTimeSegment = getTimeSegment(streamInfo!.time);
    if (focusedTimeSegment !== streamTimeSegment) {
      dispatch(focusTimeSegment(streamTimeSegment));
    }

    const focusedAudio = getCurrentSiteAudioId(state);
    if (focusedAudio !== streamInfo!.audio) {
      const stream = await api.streams.audioStream(streamInfo!.box_id);
      dispatch(setCurrentSiteAudio(streamInfo!.audio, stream!, timestamp));
    }

    if (timestamp !== undefined) {
      dispatch(seekToTime(timestamp));
    }
  };
}

/****
 * Find audio that matches the supplied site and time and slots it into siteAudioByAudioId
 *
 * If we already have audio for this time do nothing
 */
export function searchForAudio(siteId: string, time: TimeSegment) {
  return async (dispatch: any, getState: () => State) => {
    const state = getState();
    const audio = getSiteAudioByTimeSegment(state);
    if (audio[siteId][time].length) {
      // already have audio loaded
      return;
    }

    const decimalTime = parseInt(time);
    const result = await api.streams.search(siteId, decimalTime, false);
    if (result) {
      dispatch(addSiteAudioInfo(result));
    }
  };
}
