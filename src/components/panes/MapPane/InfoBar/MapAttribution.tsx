import React from "react";
import styles from "./MapAttribution.module.css";

function MapAttribution() {
  return (
    <div className={styles.MapAttribution}>
      Created by
      <a href="http://weareup.co" title="Up Creative">
        UP
      </a>
      | Map tiles by <a href="http://stamen.com">Stamen Design</a>,
      <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>| Map data ©
      <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
    </div>
  );
}

export default MapAttribution;
