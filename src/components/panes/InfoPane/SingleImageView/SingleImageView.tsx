import React, { useEffect, useMemo, useState } from "react";
import arrowLight from "../../../../icons/arrow-light.svg";
import { TaxonWithMedia } from "../../../../state/types";
import PlayButton from "../../../buttons/play/PlayButton";
import ImageCarousel from "../../../ImageCarousel/ImageCarousel";
import styles from "./SingleImageView.module.css";

interface SingleImageViewProps {
  height: number;
  taxa: TaxonWithMedia[];
  focusedTaxonId: string | null;
  focusTaxonId: (focusedTaxonId: string) => void;
}

function SingleImageView(props: SingleImageViewProps) {
  const slide = useMemo(() => {
    return props.taxa.findIndex(t => t.id === props.focusedTaxonId);
  }, [props.focusedTaxonId, props.taxa]);

  const imageUrls = useMemo(() => {
    return props.taxa.map(t => t.image.gbif_media_identifier);
  }, [props.taxa]);

  function setSlide(index: number) {
    props.focusTaxonId(props.taxa[index].id);
  }

  function next() {
    if (slide + 1 === props.taxa.length) {
      setSlide(0);
    } else {
      setSlide(slide + 1);
    }
  }

  function previous() {
    if (slide - 1 === -1) {
      setSlide(props.taxa.length - 1);
    } else {
      setSlide(slide - 1);
    }
  }

  // Set the focus to the first slide if the currently focused
  // taxon isn't in the taxa array
  useEffect(() => {
    if (slide === -1 && props.taxa.length > 0) {
      setSlide(0);
    }
  }, [setSlide, slide, props.taxa]);

  return (
    <>
      <ImageCarousel index={slide} imageUrls={imageUrls} height={props.height} />
      {props.taxa.length > 0 && slide > -1 && (
        <div className={styles.Controls}>
          <AudioButton taxon={props.taxa[slide]} />
          <button type="button" className={styles.SliderButton} onClick={previous}>
            <img className={styles.left} src={arrowLight} alt="Left Arrow" />
          </button>
          <div className={styles.InfoText}>
            <h1>{props.taxa[slide].common_name}</h1>
            <h4>{props.taxa[slide].scientific_name}</h4>
            <ul className={styles.pips}>
              {imageUrls.map((u, i) => {
                function moveToSlide() {
                  setSlide(i);
                }
                return (
                  <li
                    key={u}
                    className={`${styles.pip} ${slide === i ? styles.active : ""}`}
                    onClick={moveToSlide}
                  />
                );
              })}
            </ul>
          </div>
          <button type="button" className={styles.SliderButton} onClick={next}>
            <img src={arrowLight} alt="Right Arrow" />
          </button>
        </div>
      )}
    </>
  );
}

export default SingleImageView;

interface AudioButtonProps {
  taxon: TaxonWithMedia;
}

function AudioButton(props: AudioButtonProps) {
  const [paused, setPaused] = useState(true);

  function toggle() {
    setPaused(!paused);
  }

  if (props.taxon.audio.length === 0) {
    return null;
  }

  return (
    <PlayButton
      className={styles.AudioButton}
      onClick={toggle}
      loading={false}
      paused={paused}
      backgroundColor={"#e23e1d"}
    />
  );
}
