import React, { useEffect, useState } from "react";
import { Site } from "../../../../api/types";
import styles from "./LocationLabel.module.css";

interface LocationViewProps {
  focusedSite: Site | null;
}

function LocationView(props: LocationViewProps) {
  const [dms, setDms] = useState(null as string | null);
  const { focusedSite } = props;

  useEffect(() => {
    if (!focusedSite) {
      setDms(null);
      return;
    }

    function truncate(n: number) {
      return n > 0 ? Math.floor(n) : Math.ceil(n);
    }

    const getDMS = function(dd: number, longOrLat: "lat" | "long") {
      const hemisphere = longOrLat === "long" ? (dd < 0 ? "W" : "E") : dd < 0 ? "S" : "N";
      const absDD = Math.abs(dd);
      const degrees = truncate(absDD);
      const minutes = truncate((absDD - degrees) * 60);
      const seconds = ((absDD - degrees - minutes / 60) * Math.pow(60, 2)).toFixed(2);
      const dmsArray = [degrees, minutes, seconds, hemisphere];
      return `${dmsArray[0]}°${dmsArray[1]}'${dmsArray[2]}" ${dmsArray[3]}`;
    };

    const latDMS = getDMS(focusedSite.latitude, "lat");
    const lonDMS = getDMS(focusedSite.longitude, "long");

    setDms(`${latDMS} ${lonDMS}`);
  }, [focusedSite]);

  return (
    <div className={styles.LocationLabel}>
      <span>{dms}</span>

      <svg className={styles.icon} viewBox="0 0 239.18134 346.66666">
        <defs id="defs6">
          <clipPath id="clipPath18" clipPathUnits="userSpaceOnUse">
            <path d="M 0,260 H 179.386 V 0 H 0 Z" />
          </clipPath>
        </defs>
        <g transform="matrix(1.3333333,0,0,-1.3333333,0,346.66667)">
          <g>
            <g clipPath="url(#clipPath18)">
              <g transform="translate(89.6929,114.5109)">
                <path
                  fill="#FFFFFF"
                  fillOpacity="1"
                  fillRule="nonzero"
                  stroke="none"
                  d="m 0,0 c -30.815,0 -55.796,24.981 -55.796,55.796 0,30.816 24.981,55.797 55.796,55.797 30.815,0 55.797,-24.981 55.797,-55.797 C 55.797,24.981 30.815,0 0,0 m 0,145.489 c -49.536,0 -89.693,-40.156 -89.693,-89.693 0,-81.455 89.693,-170.307 89.693,-170.307 0,0 89.693,93.834 89.693,170.307 0,49.537 -40.157,89.693 -89.693,89.693"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default LocationView;
