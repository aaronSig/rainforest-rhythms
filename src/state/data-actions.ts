import { navigate } from "@reach/router";
import api from "../api/api";
import { StreamInfo, TimeSegment } from "../api/types";
import { getTimeSegment } from "../utils/dates";
import {
  addSiteAudioInfo,
  didFinishLoading,
  didStartLoading,
  setCurrentSiteAudio,
  setPreloadedData,
  updateSiteAudioTimestamp,
} from "./actions";
import {
  getCurrentSiteAudioId,
  getFocusedSiteId,
  getFocusedTimeSegment,
  getSiteAudio,
  getSiteAudioByAudioId,
  getSiteAudioByTimeSegment,
  getSiteAudioTimestamp,
} from "./selectors";
import { State } from "./types";

// these are actions / thunks that use the server to load in data

// Go get all the stuff we need to layout the page
export function initialLoad() {
  return async (dispatch: any) => {
    try {
      dispatch(didStartLoading());
      let [megaResponse, habitats, streams] = await Promise.all([
        api.getMegaRequest(),
        api.geoJson.habitats(),
        api.geoJson.streams(),
      ]);

      if (megaResponse === null) {
        console.warn("Issue loading mega response. Retrying...");
        megaResponse = await api.getMegaRequest();
      }

      if (megaResponse === null) {
        alert(
          "Sorry there has been an error loading. Please check you're online and try again."
        );
        return;
      }

      dispatch(setPreloadedData(megaResponse, habitats, streams));
    } finally {
      dispatch(didFinishLoading());
    }
  };
}

/****
 * Loads a specifc piece of audio, setting the site, time and optionally the timestamp
 *
 * Will download the audio StreamInfo if it's not already present
 */
export function loadAudioInfo(audioId: string, timestamp?: number) {
  // const audioId = "33631"; //14:00 6
  return async (dispatch: any, getState: () => State) => {
    try {
      dispatch(didStartLoading());
      let state = getState();
      // The site and time before we've made any API calls
      const initialFocusedSite = getFocusedSiteId(state);
      const initialFocusedTime = getFocusedTimeSegment(state);

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
      // const focusedTimeSegment = getFocusedTimeSegment(state);
      // const streamTimeSegment = getTimeSegment(streamInfo!.time);
      // if (focusedSiteId !== streamInfo!.site || focusedTimeSegment !== streamTimeSegment) {
      //   navigate(
      //     `/${streamTimeSegment}/${streamInfo!.site}/${audioId}${
      //       timestamp !== null ? `?t=${timestamp}` : ""
      //     }`,
      //     {
      //       replace: true
      //     }
      //   );
      // }

      const focusedAudio = getCurrentSiteAudioId(state);
      if (focusedAudio !== streamInfo!.audio) {
        const stream = await api.streams.audioStream(streamInfo!.box_id);

        // race condition check.
        const postStreamLoadedState = getState();
        const latestFocusedSite = getFocusedSiteId(postStreamLoadedState);
        const latestFocusedTime = getFocusedTimeSegment(postStreamLoadedState);
        const latestSiteAudio = getSiteAudio(postStreamLoadedState);

        if (
          initialFocusedSite === latestFocusedSite &&
          initialFocusedTime === latestFocusedTime &&
          latestSiteAudio.url !== stream
        ) {
          dispatch(setCurrentSiteAudio(streamInfo!.audio, stream!, timestamp));
          console.log("Stream set to ", stream);
        }
      }
    } finally {
      dispatch(didFinishLoading());
    }
  };
}

/****
 * Find audio that matches the supplied site and time and slots it into siteAudioByAudioId
 *
 * If we already have audio for this time do nothing. In most cases this will not need to do anything as it's all loaded up front.
 */
export function searchForAudio(siteId: string, time: TimeSegment) {
  return async (dispatch: any, getState: () => State) => {
    try {
      dispatch(didStartLoading());
      const state = getState();
      const audio = getSiteAudioByTimeSegment(state) as {
        [siteId: string]: { [time in TimeSegment]: StreamInfo[] };
      };
      if (siteId in audio) {
        const audioByTime: { [time in TimeSegment]: StreamInfo[] } =
          audio[siteId];
        if (audioByTime[time].length) {
          // already have audio loaded
          return;
        }
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
 * Used by the time input component. Will look up to find an audio stream and set the url to use the audio it's found
 */
export function searchForAudioAtTime(time: string, siteId: string) {
  return async (dispatch: any, getState: () => State) => {
    try {
      dispatch(didStartLoading());
      const hours = parseFloat(time);
      let minutes = 0;
      if (time.includes(":")) {
        minutes = parseFloat(time.split(":")[1]);
      }
      const decimalTime = hours + minutes / 60.0;
      console.log("Searching for ", time, decimalTime, hours, minutes);
      const result = await api.streams.search(siteId, decimalTime, true);
      console.log("Finished search", siteId, decimalTime, result);
      if (result) {
        dispatch(addSiteAudioInfo(result));
        const timeSegment = getTimeSegment(result.time);
        console.log("Setting result Audio");
        navigate(`/${timeSegment}/${siteId}/${result.audio}`);
      } else {
        // There was no audio for this time. Try and get close
        const timeSegment = getTimeSegment(time);
        console.log("Unable to find audio, navigating to timestamp");
        navigate(`/${timeSegment}/${siteId}`);
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

    console.log("Did seek", timeSegment, siteId, audioId, progressPercent);
    navigate(`/${timeSegment}/${siteId}/${audioId}?t=${progressPercent}`, {
      replace: true,
    });

    console.log("User did seek to position", progressPercent);
  };
}

/***
 * Record where the current site audio playback timestamp is
 *
 * The app is too chatty when we fire for every timestamp update (every 100ms or so)
 * here we throttle to change only when the minute has changed
 */
export function siteAudioTimestampDidUpdate(newTimestamp: number) {
  return async (dispatch: any, getState: () => State) => {
    const state = getState();
    const oldTimestamp = getSiteAudioTimestamp(state);
    const minutes = Math.round(newTimestamp / 60);
    if (oldTimestamp !== minutes) {
      dispatch(updateSiteAudioTimestamp(minutes));
    }
  };
}
