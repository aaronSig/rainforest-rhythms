import { navigate } from "@reach/router";
import { useEffect } from "react";
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
      navigate(`/09:00`, {
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

  //Search for audio to play when the site changes IF we don't have
  // streaminfo for this site already
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

  // watch for audio to load
  useEffect(() => {
    if (props.audioId) {
      props.loadAudio(props.audioId, props.timestamp);
      console.log("useIndexHook, Loading audio", props.audioId, props.timestamp);
    }
  }, [props.audioId, props.timestamp]);

  // Play the audio once we've loaded the stream info
  useEffect(() => {
    // pop the audio ID into the url. It'll be picked up in IndexView
    if (props.currentSiteAudioId === null) {
      if (props.availableAudio.length > 0) {
        const streamInfo = props.availableAudio[0];
        console.log("useIndexHook, Setting audio", streamInfo);
        navigate(`/${props.timeSegment}/${props.siteId}/${streamInfo.audio}`);
      }
    }
  }, [props.siteId, props.timeSegment, props.availableAudio, props.currentSiteAudioId]);
}
