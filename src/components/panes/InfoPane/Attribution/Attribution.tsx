import React, { useEffect, useState } from "react";
import { TaxonWithMedia } from "../../../../state/types";
import styles from "./Attribution.module.css";
import audioIcon from "./audio.svg";
import cameraIcon from "./camera.svg";
import ccIcon from "./cc.svg";

interface AttributionProps {
  taxon: TaxonWithMedia;
  isLoading: boolean;
}

export default function Attribution(props: AttributionProps) {
  const { image } = props.taxon;

  const audio = props.taxon.audio.length > 0 && props.taxon.audio[0];

  const imageRightsHolder = useRightsHolder(image.gbif_occurrence_key);
  const audioRightsHolder = useRightsHolder(audio ? audio.gbif_occurrence_key : null);

  return (
    <div className={`${styles.Attribution} ${props.isLoading ? styles.loading : ""}`}>
      <div className={styles.CCIcon}>
        <img src={ccIcon} alt="Creative Commons Icon" />
      </div>
      <div className={styles.Column}>
        <a
          className={styles.Credit}
          href={image.gbif_occurrence_key}
          target="_blank"
          rel="noopener noreferrer"
        >
          {imageRightsHolder}
          <img src={cameraIcon} alt="Camera icon" />
        </a>
        {audio && (
          <a
            className={styles.Credit}
            href={audio.gbif_occurrence_key}
            target="_blank"
            rel="noopener noreferrer"
          >
            {audioRightsHolder}
            <img src={audioIcon} alt="Audio icon" />
          </a>
        )}
      </div>
    </div>
  );
}

// Fetches the rights holder info from gbif
function useRightsHolder(occuranceKey: string | null) {
  const [rightsHolder, setRightsholder] = useState(null);

  useEffect(() => {
    setRightsholder(null);
    if (!occuranceKey) {
      return;
    }

    const apiUrl = occuranceKey.replace(
      "https://www.gbif.org/occurrence/",
      "https://api.gbif.org/v1/occurrence/"
    );
    fetch(apiUrl)
      .then(async result => {
        if (result.ok) {
          const occurance = await result.json();
          setRightsholder(occurance.rightsHolder);
        }
      })
      .catch(e => {
        console.error("Problem fetching attribution info", e);
      });
  }, [occuranceKey, setRightsholder]);

  return rightsHolder;
}
