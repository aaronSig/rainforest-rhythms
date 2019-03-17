import React, { useEffect, useRef } from "react";

/***
 * As we don't need a waveform we're not using Wavesurfer for the
 * taxon audio.
 *
 * To help with caching and cross browser quirks we're leaning on the Howler lib here
 */

interface AudioPlayerProps {
  // the source of the audio
  src: string;

  // instruct the audio to play, if it can.
  shouldPlay: boolean;

  // The audio is able to be played
  setIsReady: (ready: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsFinished: (finished: boolean) => void;
}

function AudioPlayer(props: AudioPlayerProps) {
  const sound = useRef(null as Howl | null);

  useEffect(() => {}, [sound.current]);

  return <div />;
}

export default AudioPlayer;
