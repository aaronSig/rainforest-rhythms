import { Howl } from "howler";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  setTaxonAudioFinished,
  setTaxonAudioPlaying,
  setTaxonAudioReady,
  setTaxonAudioShouldPlay
} from "../../../state/actions";
import { getTaxonAudio } from "../../../state/selectors";
import { State } from "../../../state/types";

/***
 * As we don't need a waveform we're not using Wavesurfer for the
 * taxon audio.
 *
 * To help with caching and cross browser quirks we're leaning on the Howler lib here
 *
 *
 * TODO this could likely be a custom hook instead of a component
 */

interface AudioPlayerProps {
  // the source of the audio
  src: string | null;

  // instruct the audio to play, if it can.
  shouldPlay: boolean;

  isReady: boolean;
  isPlaying: boolean;

  // The audio is able to be played
  setIsReady: (ready: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsFinished: (finished: boolean) => void;
  setShouldPlay: (shouldPlay: boolean) => void;
}

function AudioPlayerController(props: AudioPlayerProps) {
  const sound = useRef(null as Howl | null);
  const {
    src,
    shouldPlay,
    setIsReady,
    setIsPlaying,
    setIsFinished,
    isReady,
    setShouldPlay,
    isPlaying
  } = props;

  // setup the sound and the event handlers
  useEffect(() => {
    if (!src) {
      return;
    }

    console.log("Audio - setting new source");
    sound.current = new Howl({
      src: [src],
      preload: false,
      autoplay: true,
      loop: false,
      onload: () => {
        setIsReady(true);
      },
      onloaderror: err => {
        console.error("Error loading", err);
      },
      onplay: () => {
        console.log("Taxon audio is playing");
        setIsPlaying(true);
      },
      onstop: () => {
        console.log("Taxon audio has stopped");
        setIsPlaying(false);
      },
      onpause: () => {
        console.log("Taxon audio has paused");
        setIsPlaying(false);
      },
      onend: () => {
        console.log("Taxon audio has finished");
        setShouldPlay(false);
        setIsPlaying(false);
      }
    });

    return () => {
      //@ts-ignore
      sound.current && sound.current.off();
      sound.current && sound.current.stop();
      sound.current = null;
      console.log("Audio - cleanup");
    };
  }, [setIsFinished, setIsPlaying, setIsReady, setShouldPlay, sound, src]);

  useEffect(() => {
    console.log("Audio - play effect");
    if (sound.current) {
      if (shouldPlay && isPlaying) {
        return;
      }
      if (shouldPlay) {
        if (!isReady) {
          sound.current.load();
        } else {
          sound.current.play();
        }
      } else {
        // these clips are short so don't pause
        sound.current.stop();
      }
    }
  }, [sound, shouldPlay, isPlaying, isReady]);

  return <div style={{ display: "none" }} />;
}

const mapStateToProps = (state: State) => {
  const taxonAudio = getTaxonAudio(state);
  let src = null;
  if (taxonAudio.audioInfo) {
    src = taxonAudio.audioInfo.gbif_media_identifier;
  }
  return {
    src,
    shouldPlay: taxonAudio.shouldPlay,
    isReady: taxonAudio.isReady,
    isPlaying: taxonAudio.isPlaying
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setIsReady: (ready: boolean) => {
      dispatch(setTaxonAudioReady(ready));
    },
    setIsPlaying: (playing: boolean) => {
      dispatch(setTaxonAudioPlaying(playing));
    },
    setIsFinished: (finished: boolean) => {
      dispatch(setTaxonAudioFinished(finished));
    },
    setShouldPlay: (shouldPlay: boolean) => {
      dispatch(setTaxonAudioShouldPlay(shouldPlay));
    }
  };
};

const TaxonAudioPlayer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayerController);

export default TaxonAudioPlayer;
