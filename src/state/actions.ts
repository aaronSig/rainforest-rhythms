import { GeoJsonObject } from "geojson";
import { Map } from "immutable";
import { Site, StreamInfo, Taxon } from "../api/types";
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

// -- MARK audio stream info

// slots in a StreamInfo object we can use to tee up an audio stream
export const ADD_SITE_AUDIO_INFO = "ADD_SITE_AUDIO_INFO";
export function addSiteAudioInfo(info: StreamInfo) {
  return {
    type: ADD_SITE_AUDIO_INFO,
    id: info.audio,
    info
  };
}

// -- MARK focusing

export const ROUTE_DID_CHANGE = "ROUTE_DID_CHANGE";
export function routeDidChange(timeSegment: TimeSegment, siteId?: string) {
  return ax(ROUTE_DID_CHANGE, { focusedTimeSegment: timeSegment, focusedSiteId: siteId });
}

export const FOCUS_TAXON_ID = "FOCUSED_TAXON_ID";
export function focusTaxonId(focusedTaxonId: string) {
  return ax(FOCUS_TAXON_ID, { focusedTaxonId });
}

export const SET_CURRENT_SITE_AUDIO_ID = "SET_CURRENT_SITE_AUDIO_ID";
export function setCurrentSiteAudio(
  currentSiteAudioId: string,
  audioStreamUrl: string,
  timestamp?: number
) {
  return ax(SET_CURRENT_SITE_AUDIO_ID, {
    currentSiteAudioId,
    siteAudio: {
      url: audioStreamUrl,
      progress: 0,
      timestamp,
      duration: 0,
      isLoaded: false,
      isPlaying: false,
      isFinished: false,
      shouldPlay: true
    }
  });
}

export const UPDATE_SITE_AUDIO_STATE = "UPDATE_SITE_AUDIO_STATE";
export function updateSiteAudioState(
  timestamp?: number,
  duration?: number,
  isLoaded?: boolean,
  isPlaying?: boolean,
  isFinished?: boolean
) {
  return {
    type: UPDATE_SITE_AUDIO_STATE,
    timestamp,
    duration,
    isLoaded,
    isPlaying,
    isFinished
  };
}

// -- MARK loading

// call when something has started loading
export const DID_START_LOADING = "DID_START_LOADING";
export function didStartLoading() {
  return {
    type: DID_START_LOADING
  };
}

export const DID_FINISH_LOADING = "DID_FINISH_LOADING";
export function didFinishLoading() {
  return {
    type: DID_FINISH_LOADING
  };
}

// -- MARK audio

// scrub to a specific point in the audio
export const SEEK_TO_TIME = "SEEK_TO_TIME";
export function seekToTime(timestamp: number) {
  return {
    type: SEEK_TO_TIME,
    timestamp
  };
}
