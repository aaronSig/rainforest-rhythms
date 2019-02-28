import React, { Props, useCallback, useEffect } from "react";

const SITE = "site",
  AUDIO = "audio",
  TIME = "time";

/***
 *  We encode the details about the current state in the browser query string
 *
 *  audio = StreamInfo Id (not the box ID)
 *  site = site id (this may be overridden if the audio file is supplied)
 *  time = timestamp of selected audio file. Will resume playback fom here
 */

interface LocationListenerProps extends Props<any> {
  setAudioFile?: (fileId: string) => void;
}

export function LocationListener(props: LocationListenerProps) {
  // Get any params on first load
  useEffect(() => {
    console.log(window.history.state);
    const { searchParams } = new URL(window.location.href);
    // Should validate
    if (searchParams.has(AUDIO)) {
      console.log("Set audio as", searchParams.get(AUDIO));
    }
    if (searchParams.has(SITE)) {
      console.log("Site ID", searchParams.get(SITE));
    }
    if (searchParams.has(TIME)) {
      console.log("Set time", searchParams.get(TIME));
    }
  }, []);

  useCallback(() => {
    setTimeout(() => {
      console.log("here");
      window.history.pushState({ abc: 1 }, "NEW TITLE");

      console.log(window.history.state);
    }, 1000);
  }, []);

  return <>{props.children}</>;
}
