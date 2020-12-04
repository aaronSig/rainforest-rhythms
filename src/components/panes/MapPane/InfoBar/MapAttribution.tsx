import React from "react";
import styles from "./MapAttribution.module.css";

function MapAttribution() {
  return (
    <div className={styles.MapAttribution}>
      <a href='/accessibility'>Accessibility </a>
      | 
      Created by
      <a href="http://weareup.co" title="Up Creative" target="_blank">
        UP
      </a>
      | Map tiles by{" "}
      <a href="http://stamen.com" target="_blank" rel="noopener noreferrer">
        Stamen Design
      </a>
      ,
      <a
        href="http://creativecommons.org/licenses/by/3.0"
        target="_blank"
        rel="noopener noreferrer"
      >
        CC BY 3.0
      </a>
      | Map data ©
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
        OpenStreetMap
      </a>{" "}
      contributors
    </div>
  );
}

export default MapAttribution;
