import { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import macroMap from "./macro-map.png";
import styles from "./MiniMap.module.css";

interface MiniMapProps {
  focusedBounds?: LatLngBoundsExpression;
}

export function MiniMap(props: MiniMapProps) {
  return (
    <div className={styles.MiniMap}>
      <img src={macroMap} alt="Macro map of Borneo" />
    </div>
  );
}
