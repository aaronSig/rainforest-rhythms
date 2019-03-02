import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { State } from "../app/reducers";
import { audioIsPlaying, getAudioStreamURL } from "../app/selectors/audio";

interface AudioPlayerProps {
  streamUrl: string | null;
  isPlaying: boolean;
}

function AudioPlayer(props: AudioPlayerProps) {
  const player = useRef(null as null | HTMLAudioElement);

  useEffect(() => {
    console.log("AudioPlayer", props, player.current);
  });

  useEffect(() => {
    if (props.streamUrl) {
      player.current = new Audio(props.streamUrl);
    }

    return () => {
      if (player.current) {
        player.current.pause();
        player.current = null;
      }
    };
  }, [props.streamUrl]);

  useEffect(() => {
    if (player.current) {
      if (props.isPlaying) {
        player.current.play();
        console.log("Play");
      } else {
        player.current.pause();
        console.log("Pause");
      }
    }
  }, [props.isPlaying, props.streamUrl]);

  function timeUpdate() {
    console.log("currentTime", player.current!.currentTime);
  }

  function canPlay() {
    console.log("can play");
    console.log("duration", player.current!.duration);
  }

  useEffect(() => {
    if (player.current) {
      console.log("Setting listeners");
      player.current.addEventListener("timeupdate", timeUpdate);
      player.current.addEventListener("canplay", () => {
        console.log("can play");
        console.log("duration", player.current!.duration);
      });
    }

    return () => {
      if (player.current) {
        player.current.removeEventListener("timeupdate", timeUpdate);
        player.current.removeEventListener("canplay", canPlay);
      }
    };
  }, [player]);

  return <div>{}</div>;
}

const mapStateToProps = (state: State) => {
  return {
    isPlaying: audioIsPlaying(state),
    streamUrl: getAudioStreamURL(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const BoundAudioPlayer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayer);

export default BoundAudioPlayer;
