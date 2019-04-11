import { Map } from "immutable";
import { AnyAction } from "redux";
import { Taxon, TimeSegment } from "../api/types";
import {
  ADD_SITE_AUDIO_INFO,
  DID_FINISH_LOADING,
  DID_START_LOADING,
  FOCUS_TAXON_ID,
  LIGHTBOX_PHOTO,
  ROUTE_DID_CHANGE,
  SET_CURRENT_SITE_AUDIO_ID,
  SET_INTRO_SHOWING,
  SET_PRELOADED_DATA,
  SET_TAXON_AUDIO_FINISHED,
  SET_TAXON_AUDIO_PLAYING,
  SET_TAXON_AUDIO_READY,
  SET_TAXON_AUDIO_SHOULD_PLAY,
  TOGGLE_SITE_AUDIO_PLAY_STATE,
  UPDATE_SITE_AUDIO_STATE,
  UPDATE_SITE_AUDIO_TIMETAMP
} from "./actions";
import { SiteAudioState, State } from "./types";

const initialState: State = {
  initialLoadComplete: false,
  loading: 0,
  sunrise: "06:00",
  sunset: "18:00",
  introShowing: true,
  habitatData: null,
  streamData: null,
  sitesById: Map(),
  siteAudioByAudioId: Map(),
  taxaById: {} as { [taxonId: string]: Taxon },
  taxaIdBySiteId: {} as { [siteId: string]: string[] },
  taxaIdBySiteIdByTime: {} as { [siteId: string]: { [timeSegment in TimeSegment]: string[] } },
  focusedSiteId: null,
  focusedTimeSegment: "06:00",
  focusedTaxonId: null,
  currentSiteAudioId: null,
  requestedTimestamp: null,
  lightboxImageUrl: undefined,
  lightboxImageAlt: undefined,
  siteAudio: {
    url: null,
    loadedPercent: 0,
    isReady: false,
    isPlaying: false,
    isFinished: false,
    shouldPlay: false,
    wasPlaying: false, // if the audio was interupted to play the taxon audio
    timestamp: 0 // will update each minute
  },
  taxonAudio: {
    audioInfo: null,
    isReady: false,
    isPlaying: false,
    isFinished: false,
    shouldPlay: false
  }
};

export default function mainReducer(state: State = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_INTRO_SHOWING:
    case SET_PRELOADED_DATA:
    case LIGHTBOX_PHOTO:
      return Object.assign({}, state, action.item);

    case SET_CURRENT_SITE_AUDIO_ID:
    case ROUTE_DID_CHANGE: {
      if (action.item.currentSiteAudioId === state.currentSiteAudioId) {
        // no change, we're already loading this audio
        return state;
      }
      // stop any currently playing audio. Reset
      const siteAudio = Object.assign({}, initialState.siteAudio, action.item.siteAudio, {
        shouldPlay: state.siteAudio.shouldPlay
      });
      return Object.assign(
        {},
        state,
        {
          siteAudio: initialState.siteAudio,
          requestedTimestamp: null,
          currentSiteAudioId: null,
          focusedTaxonId: null,
          taxonAudio: initialState.taxonAudio
        },
        action.item,
        { siteAudio }
      );
    }

    case ADD_SITE_AUDIO_INFO: {
      return Object.assign({}, state, {
        siteAudioByAudioId: state.siteAudioByAudioId.set(action.id, action.info)
      });
    }

    case UPDATE_SITE_AUDIO_STATE: {
      const { loadedPercent, isReady, isPlaying, isFinished } = action;
      const items: { [key in keyof SiteAudioState]?: any } = {
        loadedPercent,
        isReady,
        isPlaying,
        isFinished
      };
      Object.keys(items).forEach(i => {
        //@ts-ignore
        if (items[i] === undefined || items[i] === null) {
          //@ts-ignore
          delete items[i];
        }
      });

      const siteAudio = Object.assign({}, state.siteAudio, items);
      return Object.assign({}, state, {
        siteAudio
      });
    }

    case UPDATE_SITE_AUDIO_TIMETAMP: {
      const siteAudio = Object.assign({}, state.siteAudio, { timestamp: action.timestamp });
      return Object.assign({}, state, {
        siteAudio
      });
    }

    case TOGGLE_SITE_AUDIO_PLAY_STATE: {
      const shouldPlay = !state.siteAudio.shouldPlay;
      const taxonAudio = Object.assign({}, state.taxonAudio, { shouldPlay: false });
      const siteAudio = Object.assign({}, state.siteAudio, { shouldPlay, wasPlaying: shouldPlay });
      return Object.assign({}, state, { taxonAudio, siteAudio });
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

    case FOCUS_TAXON_ID: {
      // stop the taxon audio (if playing)
      // set the taxon focused.
      // setup the new taxon audio (if available)
      const focusedTaxonId = action.item.focusedTaxonId;
      let taxonAudio = initialState.taxonAudio;

      if (focusedTaxonId) {
        const focusedTaxon = state.taxaById[focusedTaxonId];
        taxonAudio = Object.assign({}, taxonAudio, {
          audioInfo: focusedTaxon.audio
        });
      }
      return Object.assign({}, state, { focusedTaxonId, taxonAudio });
    }

    case SET_TAXON_AUDIO_READY:
    case SET_TAXON_AUDIO_PLAYING: {
      const taxonAudio = Object.assign({}, state.taxonAudio, action.item);
      return Object.assign({}, state, { taxonAudio });
    }

    case SET_TAXON_AUDIO_FINISHED: {
      const taxonAudio = Object.assign({}, state.taxonAudio, action.item);
      let siteAudio = state.siteAudio;
      if (state.siteAudio.wasPlaying) {
        siteAudio = Object.assign({}, state.siteAudio, { shouldPlay: true });
      }
      return Object.assign({}, state, { taxonAudio, siteAudio });
    }

    case SET_TAXON_AUDIO_SHOULD_PLAY: {
      const shouldPlay: boolean = action.shouldPlay;
      const taxonAudio = Object.assign({}, state.taxonAudio, { shouldPlay });

      // Pause the site audio if it is playing.
      // Resume the site audio if the taxon audio has stopped and the site audio was playing before
      const siteAudioUpdate = shouldPlay
        ? { shouldPlay: false, wasPlaying: state.siteAudio.wasPlaying }
        : { shouldPlay: state.siteAudio.wasPlaying };
      const siteAudio = Object.assign({}, state.siteAudio, siteAudioUpdate);
      return Object.assign({}, state, { taxonAudio, siteAudio });
    }

    default:
      return state;
  }
}
