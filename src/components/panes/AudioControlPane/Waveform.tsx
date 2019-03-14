import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { updateSiteAudioState } from "../../../state/actions";
import { getSiteAudio } from "../../../state/selectors";
import { AudioState, State } from "../../../state/types";
import styles from "./Waveform.module.css";

interface WaveformProps {
  siteAudio: AudioState;
  updateState: (
    timestamp?: number,
    duration?: number,
    isLoaded?: boolean,
    isPlaying?: boolean,
    isFinished?: boolean
  ) => void;
}

const settings = () => {
  const WaveSurfer = (window as any).WaveSurfer as any;
  return {
    // backend: "MediaElement",
    waveColor: "#020001",
    progressColor: "#FF450A",
    barWidth: 4,
    height: 272,
    barGap: 2,
    normalize: true,
    plugins: [
      WaveSurfer.cursor.create({
        showTime: true,
        opacity: 1,
        customShowTimeStyle: {
          "background-color": "#000",
          color: "#fff",
          padding: "2px",
          "font-size": "10px"
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

    // wavesurfer.current.load(props.siteAudio.url);
    return () => {
      wavesurfer.current.empty();
    };
  }, [wavesurfer, props.siteAudio.url]);

  // play/pause
  useEffect(() => {
    if (!wavesurfer.current) {
      return;
    }
    if (props.siteAudio.shouldPlay) {
      if (props.siteAudio.isLoaded) {
        wavesurfer.current.play();
      }
    } else {
      wavesurfer.current.pause();
    }
  }, [wavesurfer, props.siteAudio.shouldPlay, props.siteAudio.isLoaded]);

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

    wavesurfer.current.on("play", () => {
      props.updateState(undefined, undefined, true, true);
    });

    wavesurfer.current.on("loading", () => {
      props.updateState(undefined, undefined, false);
    });

    wavesurfer.current.on("pause", () => {
      props.updateState(undefined, undefined, true, false);
    });

    wavesurfer.current.on("ready", () => {
      props.updateState(undefined, undefined, true);
    });

    wavesurfer.current.on("finish", () => {
      props.updateState(undefined, undefined, true, false, true);
    });

    return () => {
      wavesurfer.current.unAll();
    };
  }, [wavesurfer, props.siteAudio.url]);

  return (
    <div className={styles.WaveformContainer}>
      <div ref={waveformRef} className={styles.Waveform} />
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    siteAudio: getSiteAudio(state)
  };
};

const mapDispatchToProps = (dispatch: any, props: WaveformProps) => {
  return {
    updateState: (
      timestamp?: number,
      duration?: number,
      isLoaded?: boolean,
      isPlaying?: boolean,
      isFinished?: boolean
    ) => {
      dispatch(updateSiteAudioState(timestamp, duration, isLoaded, isPlaying, isFinished));
    }
  };
};

const Waveform = connect(
  mapStateToProps,
  mapDispatchToProps
)(WaveformView);

export default Waveform as any;
