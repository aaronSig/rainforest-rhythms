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
  // load the geojson & sites on startup
  useEffect(() => {
    props.initialLoad();
  }, []);

  // focus the site & time segment based on the url. Start loading if needed
  useEffect(() => {
    if (!props.timeSegment) {
      //if there isn't a time segment set, set it to the closest one to the current time
      const timeSegment = getTimeSegment(format(new Date(), "HH:mm:ss"));
      navigate(`/${timeSegment}`, {
        replace: true
      });
    }
    props.updateTimeAndSite(props.timeSegment, props.siteId);
  }, [props.siteId, props.timeSegment]);

  // Add the first site to the url once the sites have loaded (if there's not one already)
  useEffect(() => {
    if (props.sitesById.count() > 0) {
      if (props.timeSegment && !props.siteId) {
        const firstSite = props.sitesById.keys().next().value;
        navigate(`/${props.timeSegment}/${firstSite}`, {
          replace: true
        });
      }
    }
  }, [props.timeSegment, props.siteId, props.sitesById]);

  //Search for the audio metadata when the site or time changes IF we don't have
  // streaminfo for this combination already
  useEffect(() => {
    if (props.siteId && props.timeSegment) {
      if (props.availableAudio.length === 0) {
        console.log("useIndexHook, Searching for audio", props.siteId, props.timeSegment);
        props.searchForAudio(props.siteId, props.timeSegment);
      }
    }
  }, [props.siteId, props.timeSegment, props.availableAudio]);

  // Add the audio ID to the url once it's loaded (if there isn't one already)
  useEffect(() => {
    if (props.siteId && props.timeSegment && !props.audioId) {
      if (props.availableAudio.length > 0) {
        const audio = props.availableAudio[0];
        navigate(`/${props.timeSegment}/${props.siteId}/${audio.audio}`, {
          replace: true
        });
      }
    }
  }, [props.siteId, props.timeSegment, props.audioId, props.availableAudio]);

  // This is triggered when the audioId is added to the url
  // watch for audio to load. This fetches the audio stream URL
  useEffect(() => {
    if (props.audioId) {
      if (props.audioId !== props.currentSiteAudioId) {
        // only load on change
        console.log("useIndexHook, Loading audio", props.audioId, props.timestamp);
        props.loadAudio(props.audioId, props.timestamp);
      } else {
        // just the timestamp has changed. We don't support seeking by manually changing the URL as
        // clicking the timeline will change the url too.
        // Seeking to a time is supported if the whole url is reladed though.
      }
    }
  }, [props.audioId, props.timestamp, props.currentSiteAudioId]);

  // Play the audio once we've loaded the stream info
  useEffect(() => {
    // pop the audio ID into the url. It'll be picked up in IndexView
    if (props.currentSiteAudioId === null) {
      if (!props.audioId && props.availableAudio.length > 0) {
        const streamInfo = props.availableAudio[0];
        console.log("useIndexHook, Setting audio", streamInfo);
        navigate(`/${props.timeSegment}/${props.siteId}/${streamInfo.audio}`);
      }
    }
  }, [
    props.siteId,
    props.timeSegment,
    props.audioId,
    props.availableAudio,
    props.currentSiteAudioId
  ]);
}
