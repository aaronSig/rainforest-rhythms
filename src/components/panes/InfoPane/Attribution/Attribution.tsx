import React from "react";
import { TaxonWithPresence } from "../../../../api/types";
import styles from "./Attribution.module.css";
import audioIcon from "./audio.svg";
import cameraIcon from "./camera.svg";
import ccIcon from "./cc.svg";

interface AttributionProps {
  taxon: TaxonWithPresence;
  isLoading: boolean;
}

export default function Attribution(props: AttributionProps) {
  if (!props.taxon.audio.gbif_rights_holder && !props.taxon.image.gbif_rights_holder) {
    return null;
  }

  return (
    <div className={`${styles.Attribution} ${props.isLoading ? styles.loading : ""}`}>
      <div className={styles.CCIcon}>
        <img src={ccIcon} alt="Creative Commons Icon" />
      </div>
      <div className={styles.Column}>
        {!props.taxon.image.gbif_rights_holder && (
          <a
            className={styles.Credit}
            href={props.taxon.image.gbif_occurrence_key || ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            {!props.taxon.image.gbif_rights_holder}
            <img src={cameraIcon} alt="Camera icon" />
          </a>
        )}
        {props.taxon.audio.gbif_rights_holder && (
          <a
            className={styles.Credit}
            href={props.taxon.audio.gbif_occurrence_key || ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            {props.taxon.audio.gbif_rights_holder}
            <img src={audioIcon} alt="Audio icon" />
          </a>
        )}
      </div>
    </div>
  );
}
