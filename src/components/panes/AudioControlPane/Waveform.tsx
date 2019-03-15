import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import useResizeAware from "react-resize-aware";
import { updateSiteAudioState } from "../../../state/actions";
import { didSeek } from "../../../state/data-actions";
import { getRequestedTimestamp, getSiteAudio } from "../../../state/selectors";
import { SiteAudioState, State } from "../../../state/types";
import styles from "./Waveform.module.css";

interface WaveformProps {
  siteAudio: SiteAudioState;
  requestedTimestamp: number | null;
  updateState: (
    loadedPercent?: number,
    isReady?: boolean,
    isPlaying?: boolean,
    isFinished?: boolean
  ) => void;
  seek: (percent: string) => void;
}

const settings = () => {
  const WaveSurfer = (window as any).WaveSurfer as any;
  return {
    backend: "MediaElement",
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
  };
};

/***
 * Handles laying out the waveform and contolling the main audio
 */
function WaveformView(props: WaveformProps) {
  const wavesurfer = useRef(null as any);
  const waveformRef = useRef(null as any);
  const [resizeComponent, containerSize] = useResizeAware();

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
    if (!wavesurfer.current || !props.siteAudio.url) {
      return;
    }
    console.log("Loading audio");
    (window as any).surfer = wavesurfer.current;
    wavesurfer.current.load(props.siteAudio.url);
    return () => {
      wavesurfer.current.empty();
    };
  }, [wavesurfer, props.siteAudio.url]);

  // play/pause
  useEffect(() => {
    if (!wavesurfer.current) {
      return;
    }
    if (props.siteAudio.shouldPlay && props.siteAudio.isReady) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  }, [wavesurfer, props.siteAudio.shouldPlay, props.siteAudio.isReady]);

  // Watch the events
  useEffect(() => {
    if (!wavesurfer.current) {
      return;
    }

    wavesurfer.current.on("error", (err: any) => {
      console.error(err);
    });

    wavesurfer.current.on("audioprocess", (timestamp: any) => {
      // this is quite chatty
      // props.updateState(timestamp, wavesurfer.current.getDuration());
    });

    wavesurfer.current.on("loading", (percent: number) => {
      console.log("loading", percent);
      props.updateState(percent);
    });

    wavesurfer.current.on("play", () => {
      props.updateState(undefined, true, true);
    });

    wavesurfer.current.on("pause", () => {
      props.updateState(undefined, true, false);
    });

    wavesurfer.current.on("seek", (progress: string) => {
      const n = parseFloat(progress).toFixed(4);
      props.seek(n);
    });

    wavesurfer.current.on("ready", () => {
      props.updateState(undefined, true);
      if (props.requestedTimestamp) {
        wavesurfer.current.seekTo(props.requestedTimestamp);
      }

      // Draw placeholder peaks.
      // Haven't included width in the deps array as don't want to trigger on resize
      const demoPeaks = Array(containerSize.width)
        .fill(0.5)
        .concat([1, -1]);

      wavesurfer.current.drawer.drawPeaks(demoPeaks, containerSize.width, 0, containerSize.width);
    });

    wavesurfer.current.on("waveform-ready", () => {
      console.log("waveform-ready");
    });

    wavesurfer.current.on("finish", () => {
      props.updateState(undefined, undefined, false, true);
    });

    return () => {
      wavesurfer.current.unAll();
    };
  }, [wavesurfer, props.siteAudio.url, props.seek, props.requestedTimestamp]);

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
    requestedTimestamp: getRequestedTimestamp(state)
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
    }
  };
};

const Waveform = connect(
  mapStateToProps,
  mapDispatchToProps
)(WaveformView);

export default Waveform as any;
