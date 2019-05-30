import React from "react";
import styles from "./MobileRoot.module.css";
import PlayBar from "./PlayBar/PlayBar";

interface MobileRootProps {}

function MobileRoot(props: MobileRootProps) {
  return (
    <div className={styles.MobileRoot}>
      <div className={styles.infoContainer} />

      <div className={styles.playbarContainer}>
        <PlayBar />
      </div>
    </div>
  );
}

export default MobileRoot;
