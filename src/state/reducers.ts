import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import { SET_TAXA_BY_ID, SET_TAXA_BY_SITE, SET_TAXA_BY_SITE_BY_TIME } from "./actions";
import { State } from "./types";

const initialState: State = {
  sunrise: "06:00",
  sunset: "18:00",
  habitatData: null,
  streamData: null,
  sitesById: {},
  siteAudioByAudioId: {},
  taxaById: Map(),
  taxaIdBySiteId: Map(),
  taxaIdBySiteIdByTime: Map(),
  taxaAudioById: {},
  taxaImageById: {},
  focusedSiteId: null,
  focusedTimeSegment: "09:00",
  focusedTaxonId: null,
  currentSiteAudioId: null,
  siteAudio: {
    progress: 0,
    timestamp: 0,
    duration: 0,
    isLoaded: false,
    isPlaying: false,
    isFinished: false
  },
  taxonAudio: {
    progress: 0,
    timestamp: 0,
    duration: 0,
    isLoaded: false,
    isPlaying: false,
    isFinished: false
  }
};

export default function mainReducer(state: State = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_TAXA_BY_ID: {
      const taxaById = state.taxaById.merge(action.item);
      return Object.assign({}, state, { taxaById });
    }

    case SET_TAXA_BY_SITE: {
      const { siteId } = action;
      let taxaIds = Set<string>(action.taxaIds);
      let taxaIdBySiteId = state.taxaIdBySiteId;
      if (taxaIdBySiteId.has(siteId)) {
        taxaIds = taxaIdBySiteId.get(siteId)!.merge(taxaIds);
      }
      taxaIdBySiteId = taxaIdBySiteId.set(siteId, taxaIds);
      return Object.assign({}, state, { taxaIdBySiteId });
    }

    case SET_TAXA_BY_SITE_BY_TIME: {
      const { siteId, time } = action;
      let taxaIds = Set<string>(action.taxaIds);
      let taxaIdBySiteIdByTime = state.taxaIdBySiteIdByTime;
      if (!taxaIdBySiteIdByTime.has(siteId)) {
        taxaIdBySiteIdByTime = taxaIdBySiteIdByTime.set(siteId, Map());
      }
      if (!taxaIdBySiteIdByTime.get(siteId)!.has(time)) {
        const byTime = taxaIdBySiteIdByTime.get(siteId)!.set(time, Set());
        taxaIdBySiteIdByTime = taxaIdBySiteIdByTime.set(siteId, byTime);
      }
      taxaIds = taxaIdBySiteIdByTime
        .get(siteId)!
        .get(time)!
        .merge(taxaIds);
      const byTime = taxaIdBySiteIdByTime.get(siteId)!.set(time, taxaIds);
      taxaIdBySiteIdByTime = taxaIdBySiteIdByTime.set(siteId, byTime);
      return Object.assign({}, state, { taxaIdBySiteIdByTime });
    }

    default:
      return state;
  }
}
