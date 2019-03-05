import { GeoJsonObject } from "geojson";
import { Map } from "immutable";
import { Site, Taxon } from "../api/types";
import ax from "./ax";
import { TimeSegment } from "./types";

// in here are normal actions that will lead into reducers

// -- MARK Taxa

export const SET_TAXA_BY_ID = "SET_TAXA_BY_ID";
export function setTaxaById(taxaById: { [id: string]: Taxon }) {
  return { type: SET_TAXA_BY_ID, item: Map(taxaById) };
}

export const SET_TAXA_BY_SITE = "SET_TAXA_BY_SITE";
export function setTaxaBySite(siteId: string, taxaIds: string[]) {
  return {
    type: SET_TAXA_BY_SITE,
    siteId,
    taxaIds
  };
}

export const SET_TAXA_BY_SITE_BY_TIME = "SET_TAXA_BY_SITE_BY_TIME";
export function setTaxaBySiteByTime(siteId: string, time: TimeSegment, taxaIds: string[]) {
  return {
    type: SET_TAXA_BY_SITE_BY_TIME,
    siteId,
    time,
    taxaIds
  };
}

// -- MARK preload

export const SET_PRELOADED_DATA = "SET_PRELOADED_DATA";
export function setPreloadedData(
  habitatData: GeoJsonObject,
  streamData: GeoJsonObject,
  sitesById: Map<string, Site>
) {
  return ax(SET_PRELOADED_DATA, { habitatData, streamData, sitesById });
}

// -- MARK focusing

export const FOCUS_SITE_ID = "FOCUS_SITE_ID";
export function focusSiteId(focusedSiteId: string) {
  return ax(FOCUS_SITE_ID, { focusedSiteId });
}

export const FOCUS_TIME_SEGMENT = "FOCUS_TIME_SEGMENT";
export function focusTimeSegment(focusedTimeSegment: TimeSegment) {
  return ax(FOCUS_TIME_SEGMENT, { focusedTimeSegment });
}

export const FOCUS_TAXON_ID = "FOCUSED_TAXON_ID";
export function focusTaxonId(focusedTaxonId: string) {
  return ax(FOCUS_TAXON_ID, { focusedTaxonId });
}

// The ID of the audio to switch to and load (and play)
export const SET_CURRENT_SITE_AUDIO_ID = "SET_CURRENT_SITE_AUDIO_ID";
export function setCurrentSiteAudio(currentSiteAudioId: string) {
  return ax(SET_CURRENT_SITE_AUDIO_ID, { currentSiteAudioId });
}
