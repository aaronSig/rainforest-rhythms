import { addMinutes, format, isValid, parse } from "date-fns";
import { createSelector } from "reselect";
import { StreamInfo, Taxon, TaxonWithPresence, TimeSegment } from "../api/types";
import { getTimeSegment } from "../utils/dates";
import { allTimeSegments, State } from "./types";

export const isInitialLoadComplete = (state: State) => state.initialLoadComplete;
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
export const getFocusedSiteId = (state: State) => state.focusedSiteId;
export const getFocusedTimeSegment = (state: State) => state.focusedTimeSegment;
export const getFocusedTaxonId = (state: State) => state.focusedTaxonId;
export const getCurrentSiteAudioId = (state: State) => state.currentSiteAudioId;
export const getSiteAudio = (state: State) => state.siteAudio;
export const getRequestedTimestamp = (state: State) => state.requestedTimestamp;
export const getTaxonAudio = (state: State) => state.taxonAudio;
export const getSiteAudioTimestamp = (state: State) => state.siteAudio.timestamp;
export const getLightboxImage = (state: State) => state.lightboxImageUrl;
export const getLightboxImageAlt = (state: State) => state.lightboxImageAlt;

// An array of all the sites
export const getAllSites = createSelector(
  [getSitesById],
  sitesById => Array.from(sitesById.values())
);

// The audio loaded for this site and time
export const getCurrentSiteAudio = createSelector(
  [getCurrentSiteAudioId, getSiteAudioByAudioId],
  (currentAudioId, audioById) => {
    if (currentAudioId === null || !audioById.has(currentAudioId)) {
      return null;
    }
    return audioById.get(currentAudioId)!;
  }
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
    if (allSiteIds.length === 0) {
      // still loading
      return {};
    }

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
    siteAudioByAudioId
      .valueSeq()
      .filter(a => allSiteIds.includes(a.site)) // protect for when sites haven't yet loaded
      .forEach(a => {
        const segment = getTimeSegment(a.time) as TimeSegment;
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
  (
    focusedSiteId,
    focusedTimeSegment,
    siteAudioByTimeSegment: { [siteId: string]: { [time in TimeSegment]: StreamInfo[] } }
  ) => {
    if (!focusedSiteId || !focusedTimeSegment) {
      return [];
    }

    if (focusedSiteId in siteAudioByTimeSegment) {
      return siteAudioByTimeSegment[focusedSiteId][focusedTimeSegment];
    }

    return [];
  }
);

/***
 * An array of the taxa that appear at the currently focused site
 */
export const getTaxaForFocusedSite = createSelector(
  [getFocusedSiteId, getTaxaIdBySiteId, getTaxaById],
  (focusedSiteId, taxaIdBySiteId, taxaById) => {
    if (!focusedSiteId || !(focusedSiteId in taxaIdBySiteId)) {
      return [] as Taxon[];
    }
    const taxa = taxaIdBySiteId[focusedSiteId]
      .map(id => {
        return taxaById[id];
      })
      .filter(t => t !== undefined);

    return taxa;
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
      !(focusedSiteId in taxaIdBySiteIdByTime) ||
      !(focusedTimeSegment in taxaIdBySiteIdByTime[focusedSiteId])
    ) {
      return [] as Taxon[];
    }
    const taxa = taxaIdBySiteIdByTime[focusedSiteId][focusedTimeSegment]
      .map(id => {
        return taxaById[id];
      })
      .filter(t => t !== undefined);

    return taxa;
  }
);

/***
 * The species that appear at this site, sorted to put the ones that ususally appear at this time at the top
 *
 * Filters out any without images.
 *
 * TODO Corrects images that have the incorrect relative referencing
 */
export const getTaxaWithPresence = createSelector(
  [getTaxaForFocusedSite, getTaxaForFocusedSiteAtCurrentTime],
  (taxaForFocusedSite, taxaForFocusedSiteAtCurrentTime) => {
    const withPresence = taxaForFocusedSite
      .filter(t => t.image.media_url !== null)
      .map(t =>
        Object.assign({}, t, {
          seenAtThisTime: taxaForFocusedSiteAtCurrentTime.includes(t)
        })
      ) as TaxonWithPresence[];

    return withPresence
      .sort((a, b) => (a.common_name < b.common_name ? -1 : 1))
      .sort((a, b) => (a.seenAtThisTime && !b.seenAtThisTime ? -1 : 1));
  }
);

export const getFocusedSite = createSelector(
  [getFocusedSiteId, getSitesById],
  (focusedSiteId, sitesById) => {
    if (!focusedSiteId || !sitesById || !sitesById.has(focusedSiteId)) {
      return null;
    }
    return sitesById.get(focusedSiteId)!;
  }
);

/***
 * Get the time for the clock on the page
 *
 * This is a combo of the audio time + timestamp / timesegment
 */
export const getTimeOfDay = createSelector(
  [getFocusedTimeSegment, getSiteAudio, getCurrentSiteAudio, getSiteAudioTimestamp],
  (timesegment, siteAudio, streamInfo, timestampMinutes) => {
    if (!streamInfo || siteAudio.url === null) {
      return timesegment;
    }
    const date = parse(`${streamInfo.date}T${streamInfo.time}`);
    const valid = isValid(date);
    if (!valid) {
      return timesegment;
    }
    const additional = addMinutes(date, timestampMinutes);
    return format(additional, "HH:mm");
  }
);
