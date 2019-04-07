import { navigate } from "@reach/router";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { TimeSegment } from "../../../api/types";
import { updateSiteAudioState } from "../../../state/actions";
import { didSeek, siteAudioTimestampDidUpdate } from "../../../state/data-actions";
import {
  getCurrentSiteAudioId,
  getFocusedSiteId,
  getFocusedTimeSegment,
  getRequestedTimestamp,
  getSiteAudio
} from "../../../state/selectors";
import { allTimeSegments, SiteAudioState, State } from "../../../state/types";
import useResizeAware from "../../../utils/useResizeAware";
import styles from "./Waveform.module.css";

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const allowPlaybackBeforeLoad = !isSafari;

interface WaveformProps {
  siteAudio: SiteAudioState;
  currentSiteAudioId: string | null;
  focusedTimeSegment: TimeSegment;
  focusedSiteId: string | null;
  requestedTimestamp: number | null;
  updateState: (
    loadedPercent?: number,
    isReady?: boolean,
    isPlaying?: boolean,
    isFinished?: boolean
  ) => void;
  seek: (percent: string) => void;
  timestampDidUpdate: (timestamp: number) => void;
}

const settings = () => {
  const WaveSurfer = (window as any).WaveSurfer as any;

  // Safari has tighter restrictions on when a media element can be created
  // that can play. As we have to load the StreamInfo after the click it's unlikely
  // the media element will be made soon enough after the click to work.
  const backend: any = {};
  if (allowPlaybackBeforeLoad) {
    backend["backend"] = "MediaElement";
  }

  return Object.assign(
    {
      waveColor: "#020001",
      progressColor: "#FF450A",
      responsive: true,
      barWidth: 4,
      height: 272,
      barGap: 2,
      normalize: true,
      plugins: [
        WaveSurfer.cursor.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            "background-color": "#7cb8b2",
            color: "#fff",
            padding: "4px",
            transform: "translateY(-100px)",
            "font-family": `"Lato", sans-serif`,
            "font-size": "13px"
          }
        })
      ]
    },
    backend
  );
};

/***
 * Handles laying out the waveform and contolling the main audio
 */
function WaveformView(props: WaveformProps) {
  const {
    siteAudio,
    requestedTimestamp,
    updateState,
    seek,
    timestampDidUpdate,
    focusedTimeSegment,
    focusedSiteId,
    currentSiteAudioId
  } = props;
  const isFinishedPlaying = siteAudio.isFinished;

  const wavesurfer = useRef(null as any);
  const waveformRef = useRef(null as any);
  const [resizeComponent, containerSize] = useResizeAware();
  const width = containerSize.width;

  // Setup the wavesurfer object
  useEffect(() => {
    if (!waveformRef.current) {
      return;
    }
    const WaveSurfer = (window as any).WaveSurfer as any;
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      ...settings()
    });
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [wavesurfer, waveformRef]);

  // Loading audio in when the url is set
  useEffect(() => {
    if (!wavesurfer.current || !siteAudio.url) {
      return;
    }
    console.log("Loading audio");
    (window as any).surfer = wavesurfer.current;
    wavesurfer.current.load(siteAudio.url);
    return () => {
      updateState(undefined, false);
      try {
        // this can throw when audio hasn't loaded correctly
        wavesurfer.current.empty();
      } catch {}
    };
  }, [wavesurfer, siteAudio.url, updateState]);

  // Ensure the app is not in a ready state when there's no audio loaded
  // (prevents the old audio hanging over)
  useEffect(() => {
    if (currentSiteAudioId === null) {
      updateState(undefined, false);
    }
  }, [currentSiteAudioId, updateState]);

  // play/pause
  useEffect(() => {
    if (!wavesurfer.current) {
      return;
    }
    if (siteAudio.shouldPlay && siteAudio.isReady && currentSiteAudioId !== null) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  }, [wavesurfer, siteAudio.shouldPlay, siteAudio.isReady, currentSiteAudioId]);

  // Navigate to the next audio when audio finishes
  useEffect(() => {
    if (!isFinishedPlaying) {
      return;
    }
    const index = allTimeSegments.findIndex(t => t === focusedTimeSegment);
    const afterIndex = (allTimeSegments.length + index + 1) % allTimeSegments.length;
    const nextTimeSegment = allTimeSegments[afterIndex];

    let url = `/${nextTimeSegment}`;
    if (focusedSiteId) {
      url = `/${nextTimeSegment}/${focusedSiteId}`;
    }
    navigate(url);
  }, [focusedSiteId, focusedTimeSegment, isFinishedPlaying]);

  // Watch the events
  useEffect(() => {
    if (!wavesurfer.current) {
      return;
    }

    wavesurfer.current.on("error", (err: any) => {
      console.log("Error loading audio", siteAudio.url);
      console.error(err);
    });

    // timestamp is in seconds
    wavesurfer.current.on("audioprocess", (timestamp: any) => {
      // this is quite chatty so function being called will debounce and only
      // update the state each minute
      timestampDidUpdate(timestamp);
    });

    wavesurfer.current.on("loading", (percent: number) => {
      // console.log("loading", percent);
      // updateState(percent);
    });

    wavesurfer.current.on("play", () => {
      updateState(undefined, undefined, true);
    });

    wavesurfer.current.on("pause", () => {
      updateState(undefined, undefined, false);
    });

    wavesurfer.current.on("seek", (progress: string) => {
      const n = parseFloat(progress).toFixed(4);
      seek(n);
    });

    wavesurfer.current.on("ready", () => {
      updateState(undefined, true);
      if (requestedTimestamp) {
        console.log("SEEKING TO TIMESTAMP", requestedTimestamp);
        wavesurfer.current.seekTo(requestedTimestamp);
      }

      if (allowPlaybackBeforeLoad) {
        // Draw placeholder peaks.
        // Haven't included width in the deps array as don't want to trigger on resize
        const demoPeaks = Array(width! * 2)
          .fill(0.5)
          .concat([1, -1]);

        wavesurfer.current.drawer.drawPeaks(demoPeaks, width! * 2, 0, width! * 2);
      }
    });

    wavesurfer.current.on("waveform-ready", () => {
      console.log("waveform-ready");
      // updateState(undefined, true);
    });

    wavesurfer.current.on("finish", () => {
      updateState(undefined, undefined, false, true);
    });

    return () => {
      wavesurfer.current.unAll();
    };
  }, [wavesurfer, siteAudio.url, seek, requestedTimestamp, updateState, width, timestampDidUpdate]);

  return (
    <div className={styles.WaveformContainer}>
      <div ref={waveformRef} className={styles.Waveform}>
        {resizeComponent}
      </div>
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    siteAudio: getSiteAudio(state),
    requestedTimestamp: getRequestedTimestamp(state),
    focusedTimeSegment: getFocusedTimeSegment(state),
    focusedSiteId: getFocusedSiteId(state),
    currentSiteAudioId: getCurrentSiteAudioId(state)
  };
};

const mapDispatchToProps = (dispatch: any, props: WaveformProps) => {
  return {
    updateState: (
      loadedPercent?: number,
      isReady?: boolean,
      isPlaying?: boolean,
      isFinished?: boolean
    ) => {
      dispatch(updateSiteAudioState(loadedPercent, isReady, isPlaying, isFinished));
    },
    seek: (percent: string) => {
      dispatch(didSeek(percent));
    },
    timestampDidUpdate: (timestamp: number) => {
      dispatch(siteAudioTimestampDidUpdate(timestamp));
    }
  };
};

const Waveform = connect(
  mapStateToProps,
  mapDispatchToProps
)(WaveformView);

export default Waveform as any;
