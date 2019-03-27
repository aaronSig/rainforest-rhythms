import React, { useCallback, useEffect, useMemo } from "react";
import arrowLight from "../../../../icons/arrow-light.svg";
import { TaxonWithMedia } from "../../../../state/types";
import ImageCarousel from "../../../ImageCarousel/ImageCarousel";
import Attribution from "../Attribution/Attribution";
import TaxonAudioButton from "../TaxonAudioButton";
import styles from "./SingleImageView.module.css";

interface SingleImageViewProps {
  height: number;
  isLoading: boolean;
  taxa: TaxonWithMedia[];
  focusedTaxonId: string | null;
  focusTaxonId: (focusedTaxonId: string) => void;
  zoomImage: (url: string, alt: string) => void;
}

function SingleImageView(props: SingleImageViewProps) {
  const { height, taxa, focusedTaxonId, focusTaxonId, zoomImage } = props;

  const slide = useMemo(() => {
    return taxa.findIndex(t => t.id === focusedTaxonId);
  }, [focusedTaxonId, taxa]);

  const imageUrls = useMemo(() => {
    return taxa
      .map(t => {
        if (t.image.media_identifier) {
          return `${process.env.PUBLIC_URL}/taxon-imagery/${t.image.media_identifier}`;
        }
        return t.image.gbif_media_identifier;
      })
      .filter(i => i !== undefined) as string[];
  }, [taxa]);

  const setSlide = useCallback(
    (index: number) => {
      focusTaxonId(taxa[index].id);
    },
    [focusTaxonId, taxa]
  );

  function next() {
    if (slide + 1 === taxa.length) {
      setSlide(0);
    } else {
      setSlide(slide + 1);
    }
  }

  function previous() {
    if (slide - 1 === -1) {
      setSlide(taxa.length - 1);
    } else {
      setSlide(slide - 1);
    }
  }

  // Set the focus to the first slide if the currently focused
  // taxon isn't in the taxa array
  useEffect(() => {
    if (slide === -1 && taxa.length > 0) {
      setSlide(0);
    }
  }, [setSlide, slide, taxa]);

  const zoomImageOnClick = useCallback(
    (imageUrl: string) => {
      const alt = focusedTaxonId
        ? taxa.find(t => t.id === focusedTaxonId)!.common_name
        : "Taxon Image";
      zoomImage(imageUrl, alt);
    },
    [focusedTaxonId, taxa, zoomImage]
  );

  const taxon = taxa[slide];

  return (
    <>
      <ImageCarousel
        index={slide}
        imageUrls={imageUrls}
        height={height}
        onClick={zoomImageOnClick}
      />
      {taxon && <Attribution isLoading={props.isLoading} taxon={taxon} />}
      {taxa.length > 0 && slide > -1 && (
        <div className={styles.Controls}>
          <TaxonAudioButton taxon={taxa[slide]} />
          <button type="button" className={styles.SliderButton} onClick={previous}>
            <img className={styles.left} src={arrowLight} alt="Left Arrow" />
          </button>
          <div className={styles.InfoText}>
            <h1>{taxa[slide].common_name}</h1>
            <h4>
              <a
                href={`https://www.gbif.org/species/${taxon.gbif_key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {taxa[slide].scientific_name}
              </a>
            </h4>
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
