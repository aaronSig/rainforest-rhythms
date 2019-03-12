import { createSelector } from "reselect";
import { StreamInfo } from "../api/types";
import { getTimeSegment } from "../utils/dates";
import { allTimeSegments, State, TimeSegment } from "./types";

export const isLoading = (state: State) => state.loading > 0;
export const getSunrise = (state: State) => state.sunrise;
export const getSunset = (state: State) => state.sunset;
export const getHabitatData = (state: State) => state.habitatData;
export const getStreamData = (state: State) => state.streamData;
export const getSitesById = (state: State) => state.sitesById;
export const getSiteAudioByAudioId = (state: State) => state.siteAudioByAudioId;
export const getTaxaById = (state: State) => state.taxaById;
export const getTaxaIdBySiteId = (state: State) => state.taxaIdBySiteId;
export const getTaxaIdBySiteIdByTime = (state: State) => state.taxaIdBySiteIdByTime;
export const getTaxaAudioById = (state: State) => state.taxaAudioById;
export const getTaxaImageById = (state: State) => state.taxaImageById;
export const getFocusedSiteId = (state: State) => state.focusedSiteId;
export const getFocusedTimeSegment = (state: State) => state.focusedTimeSegment;
export const getFocusedTaxonId = (state: State) => state.focusedTaxonId;
export const getCurrentSiteAudioId = (state: State) => state.currentSiteAudioId;
export const getSiteAudio = (state: State) => state.siteAudio;
export const getTaxonAudio = (state: State) => state.taxonAudio;

// An array of all the sites
export const getAllSites = createSelector(
  [getSitesById],
  sitesById => Array.from(sitesById.values())
);

/***
 * Retuns an array of StreamInfo objects organised by site and TimeSegment
 * {
 *    [siteId: key]: {
 *      [time: TimeSegment]: StreamInfo[] // sorted by date, ascending
 *    }
 * }
 */
export const getSiteAudioByTimeSegment = createSelector(
  [getSitesById, getSiteAudioByAudioId],
  (sitesById, siteAudioByAudioId) => {
    const siteAudioByTimeSegment: {
      [siteId: string]: { [time in TimeSegment]: StreamInfo[] };
    } = {};

    // build up the structure
    const allSiteIds = Array.from(sitesById.keys());
    for (const siteId of allSiteIds) {
      siteAudioByTimeSegment[siteId] = allTimeSegments.reduce(
        (acc, curr: TimeSegment) => {
          acc[curr] = [] as StreamInfo[];
          return acc;
        },
        {} as { [time in TimeSegment]: StreamInfo[] }
      );
    }

    // add in the data
    Object.values(siteAudioByAudioId).forEach(a => {
      const segment = getTimeSegment(a.time);
      siteAudioByTimeSegment[a.site][segment].push(a);
      siteAudioByTimeSegment[a.site][segment].sort((a, b) => (a.time < b.time ? 1 : -1));
    });

    return siteAudioByTimeSegment;
  }
);

/***
 * Returns an array of StreamInfo objects for the current selected site & time.
 *
 * If we don't have any audio yet will return and empty array
 *
 * StreamInfo[]
 */
export const getAudioForFocusedSiteAtCurrentTime = createSelector(
  [getFocusedSiteId, getFocusedTimeSegment, getSiteAudioByTimeSegment],
  (focusedSiteId, focusedTimeSegment, siteAudioByTimeSegment) => {
    if (!focusedSiteId || !focusedTimeSegment) {
      return [];
    }
    return siteAudioByTimeSegment[focusedSiteId][focusedTimeSegment];
  }
);

/***
 * An array of the taxa that appear at the currently focused site
 */
export const getTaxaForFocusedSite = createSelector(
  [getFocusedSiteId, getTaxaIdBySiteId, getTaxaById],
  (focusedSiteId, taxaIdBySiteId, taxaById) => {
    if (!focusedSiteId || !taxaIdBySiteId.has(focusedSiteId)) {
      return [];
    }
    return taxaIdBySiteId.get(focusedSiteId)!.map(id => {
      return taxaById.get(id);
    });
  }
);

/***
 * An array of the taxa that appear at the currently focused site and time
 */
export const getTaxaForFocusedSiteAtCurrentTime = createSelector(
  [getFocusedSiteId, getFocusedTimeSegment, getTaxaIdBySiteIdByTime, getTaxaById],
  (focusedSiteId, focusedTimeSegment, taxaIdBySiteIdByTime, taxaById) => {
    if (
      !focusedSiteId ||
      focusedTimeSegment === null ||
      !taxaIdBySiteIdByTime.has(focusedSiteId) ||
      !taxaIdBySiteIdByTime.get(focusedSiteId)!.has(focusedTimeSegment)
    ) {
      return [];
    }
    return taxaIdBySiteIdByTime
      .get(focusedSiteId)!
      .get(focusedTimeSegment)!
      .map(id => {
        return taxaById.get(id);
      });
  }
);

export const getFocusedSite = createSelector(
  [getFocusedSiteId, getSitesById],
  (focusedSiteId, sitesById) => {
    if (!focusedSiteId || !sitesById.has(focusedSiteId)) {
      return null;
    }
    return sitesById.get(focusedSiteId)!;
  }
);
