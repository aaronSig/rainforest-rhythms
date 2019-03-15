import { navigate } from "@reach/router";
import { Map } from "immutable";
import api from "../api/api";
import { Site, Taxon } from "../api/types";
import { byNumberKey } from "../utils/objects";
import {
  addSiteAudioInfo,
  didFinishLoading,
  didStartLoading,
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
    try {
      dispatch(didStartLoading());
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
    } finally {
      dispatch(didFinishLoading());
    }
  };
}

export function loadTaxaForSite(siteId: string, time: TimeSegment | null = null) {
  return async (dispatch: any) => {
    try {
      dispatch(didStartLoading());
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
    } finally {
      dispatch(didFinishLoading());
    }
  };
}

/****
 * Loads a specifc piece of audio, setting the site, time and optionally the timestamp
 */
export function loadAudioInfo(audioId: string, timestamp?: number) {
  return async (dispatch: any, getState: () => State) => {
    try {
      dispatch(didStartLoading());
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

      // This code would set the site & time to what the current audio shows
      // but can be a source of bugs. If the app is used correctly
      // then the site and time should never end up out of sync with the audio
      // const focusedSiteId = getFocusedSiteId(state);
      // if (focusedSiteId !== streamInfo!.site) {
      //   dispatch(focusSiteId(streamInfo!.site));
      // }
      // const focusedTimeSegment = getFocusedTimeSegment(state);
      // const streamTimeSegment = getTimeSegment(streamInfo!.time);
      // if (focusedTimeSegment !== streamTimeSegment) {
      //   dispatch(focusTimeSegment(streamTimeSegment));
      // }

      const focusedAudio = getCurrentSiteAudioId(state);
      if (focusedAudio !== streamInfo!.audio) {
        const stream = await api.streams.audioStream(streamInfo!.box_id);
        dispatch(setCurrentSiteAudio(streamInfo!.audio, stream!, timestamp));
        console.log("Stream set to ", stream);
      }
    } finally {
      dispatch(didFinishLoading());
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
    try {
      dispatch(didStartLoading());
      const state = getState();
      const audio = getSiteAudioByTimeSegment(state);
      if (siteId in audio && audio[siteId][time].length) {
        // already have audio loaded
        return;
      }

      const decimalTime = parseInt(time);
      const result = await api.streams.search(siteId, decimalTime, false);
      console.log("Finished search", siteId, decimalTime, result);
      if (result) {
        dispatch(addSiteAudioInfo(result));
      }
    } finally {
      dispatch(didFinishLoading());
    }
  };
}

/***
 * Called when the user has clicked on the audio waveform.
 * In here we update the URL so people can share this audio at this time
 */
export function didSeek(progressPercent: string) {
  return async (dispatch: any, getState: () => State) => {
    const state = getState();
    const siteId = getFocusedSiteId(state);
    const timeSegment = getFocusedTimeSegment(state);
    const audioId = getCurrentSiteAudioId(state);

    if (siteId === null || audioId === null) {
      return;
    }

    navigate(`/${timeSegment}/${siteId}/${audioId}?t=${progressPercent}`, {
      replace: true
    });

    console.log("User did seek to position", progressPercent);
  };
}
