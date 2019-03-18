import React from "react";
import { connect } from "react-redux";
import { setTaxonAudioShouldPlay } from "../../../state/actions";
import { getTaxonAudio } from "../../../state/selectors";
import { State, TaxonAudioState, TaxonWithMedia } from "../../../state/types";
import PlayButton from "../../buttons/play/PlayButton";
import styles from "./TaxonAudioButton.module.css";

interface TaxonAudioButtonProps {
  taxon: TaxonWithMedia;
  taxonAudioState: TaxonAudioState;
  shouldPlay: (shouldPlay: boolean) => void;
}

function TaxonAudioButtonView(props: TaxonAudioButtonProps) {
  const audio = props.taxonAudioState;
  const { taxon } = props;

  if (props.taxon.audio.length === 0) {
    return null;
  }

  function toggle() {
    props.shouldPlay(!audio.isPlaying);
  }

  const loading = audio.shouldPlay && !audio.isPlaying;

  let label = `Hear a clip of a ${taxon.common_name} ${taxon.audio[0].gbif_occurrence_behavior}`;
  if (!audio.isReady) {
    label = `Loading clip`;
  } else if (audio.isPlaying) {
    label = `Pause clip`;
  }

  return (
    <PlayButton
      ariaLabel={label}
      className={styles.TaxonAudioButton}
      onClick={toggle}
      loading={loading}
      paused={!audio.isPlaying}
      backgroundColor={"#e23e1d"}
    />
  );
}

const mapStateToProps = (state: State) => {
  return {
    taxonAudioState: getTaxonAudio(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    shouldPlay: (shouldPlay: boolean) => {
      dispatch(setTaxonAudioShouldPlay(shouldPlay));
    }
  };
};

const TaxonAudioButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaxonAudioButtonView);

export default TaxonAudioButton;
