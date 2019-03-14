import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import {
  ADD_SITE_AUDIO_INFO,
  DID_FINISH_LOADING,
  DID_START_LOADING,
  FOCUS_TAXON_ID,
  ROUTE_DID_CHANGE,
  SEEK_TO_TIME,
  SET_CURRENT_SITE_AUDIO_ID,
  SET_PRELOADED_DATA,
  SET_TAXA_BY_ID,
  SET_TAXA_BY_SITE,
  SET_TAXA_BY_SITE_BY_TIME,
  UPDATE_SITE_AUDIO_STATE
} from "./actions";
import { State } from "./types";

const initialState: State = {
  loading: 0,
  sunrise: "06:00",
  sunset: "18:00",
  habitatData: null,
  streamData: null,
  sitesById: Map({
    "1": {
      site_name: "E100_edge",
      habitat: "Logged Fragment",
      short_desc: null,
      longitude: 117.58604,
      latitude: 4.68392,
      id: "1",
      n_audio: 3826
    }
  }),
  siteAudioByAudioId: Map(),
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
    url: null,
    progress: 0,
    timestamp: 0,
    duration: 0,
    isLoaded: false,
    isPlaying: false,
    isFinished: false,
    shouldPlay: false
  },
  taxonAudio: {
    url: null,
    progress: 0,
    timestamp: 0,
    duration: 0,
    isLoaded: false,
    isPlaying: false,
    isFinished: false,
    shouldPlay: false
  }
};

export default function mainReducer(state: State = initialState, action: AnyAction) {
  console.log("action", action);
  switch (action.type) {
    case SET_PRELOADED_DATA:
    case FOCUS_TAXON_ID:
      return Object.assign({}, state, action.item);

    case SET_CURRENT_SITE_AUDIO_ID:
    case ROUTE_DID_CHANGE: {
      // stop any currently playing audio
      return Object.assign(
        {},
        state,
        {
          siteAudio: {
            url: null,
            progress: 0,
            timestamp: 0,
            duration: 0,
            isLoaded: false,
            isPlaying: false,
            isFinished: false,
            shouldPlay: false
          }
        },
        action.item
      );
    }

    case ADD_SITE_AUDIO_INFO: {
      return Object.assign({}, state, {
        siteAudioByAudioId: state.siteAudioByAudioId.set(action.id, action.info)
      });
    }

    case UPDATE_SITE_AUDIO_STATE: {
      const { timestamp, duration, isLoaded, isPlaying, isFinished } = action;
      const items = {
        timestamp,
        duration,
        isLoaded,
        isPlaying,
        isFinished,
        progress: timestamp !== undefined && duration !== undefined && timestamp / duration
      };
      Object.keys(items).forEach(i => {
        //@ts-ignore
        if (items[i] === undefined) {
          //@ts-ignore
          delete items[i];
        }
      });

      const siteAudio = Object.assign({}, state.siteAudio, items);
      return Object.assign({}, state, {
        siteAudio
      });
    }

    case DID_START_LOADING: {
      return Object.assign({}, state, {
        loading: state.loading + 1
      });
    }

    case DID_FINISH_LOADING: {
      return Object.assign({}, state, {
        loading: Math.max(0, state.loading - 1)
      });
    }

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

    case SEEK_TO_TIME: {
      console.error("SEEK_TO_TIME has not been implemented");
      return state;
    }

    default:
      return state;
  }
}
