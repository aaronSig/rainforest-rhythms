import { navigate } from "@reach/router";
import { format } from "date-fns";
import { useEffect } from "react";
import { getTimeSegment } from "../../utils/dates";
import { IndexProps } from "./Index";
/**
 * pulling out the main logic. Anything that controls data fetching
 * or nav is in here
 */
export default function useIndexHook(props: IndexProps) {
  const {
    siteId,
    timeSegment,
    updateTimeAndSite,
    initialLoad,
    audioId,
    timestamp,
    availableAudio,
    currentSiteAudioId,
    sitesById,
    loadAudio,
    searchForAudio
  } = props;

  // load the geojson & sites on startup
  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  // focus the site & time segment based on the url. Start loading if needed
  useEffect(() => {
    if (!timeSegment) {
      //if there isn't a time segment set, set it to the closest one to the current time
      const timeSegment = getTimeSegment(format(new Date(), "HH:mm:ss"));
      navigate(`/${timeSegment}`, {
        replace: true
      });
    }
    updateTimeAndSite(timeSegment, siteId);
  }, [siteId, timeSegment, updateTimeAndSite]);

  // Add the first site to the url once the sites have loaded (if there's not one already)
  useEffect(() => {
    if (sitesById.count() > 0) {
      if (timeSegment && !siteId) {
        const firstSite = sitesById.keys().next().value;
        navigate(`/${timeSegment}/${firstSite}`, {
          replace: true
        });
      }
    }
  }, [timeSegment, siteId, sitesById]);

  //Search for the audio metadata when the site or time changes IF we don't have
  // streaminfo for this combination already
  useEffect(() => {
    if (siteId && timeSegment) {
      if (availableAudio.length === 0) {
        console.log("useIndexHook, Searching for audio", siteId, timeSegment);
        searchForAudio(siteId, timeSegment);
      }
    }
  }, [siteId, timeSegment, availableAudio, searchForAudio]);

  // This is triggered when the audioId is added to the url
  // watch for audio to load. This fetches the audio stream URL
  useEffect(() => {
    if (audioId) {
      if (audioId !== currentSiteAudioId) {
        // only load on change
        loadAudio(audioId, timestamp);
      } else {
        // just the timestamp has changed. We don't support seeking by manually changing the URL as
        // clicking the timeline will change the url too.
        // Seeking to a time is supported if the whole url is reladed though.
      }
    }
  }, [audioId, timestamp, currentSiteAudioId, loadAudio]);

  // Play the audio once we've loaded the stream info
  useEffect(() => {
    // pop the audio ID into the url. It'll be picked up in IndexView
    if (currentSiteAudioId === null) {
      if (!audioId && availableAudio.length > 0) {
        const streamInfo = availableAudio[0];
        console.log("useIndexHook, Setting audio", streamInfo);
        navigate(`/${timeSegment}/${siteId}/${streamInfo.audio}`);
      }
    }
  }, [siteId, timeSegment, audioId, availableAudio, currentSiteAudioId]);
}
