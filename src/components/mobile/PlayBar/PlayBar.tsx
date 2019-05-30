import React from "react";
import styles from "./PlayBar.module.css";

//https://sghall.github.io/react-compound-slider/#/

interface PlayBarProps {}

function PlayBar(props: PlayBarProps) {
  return (
    <div className={styles.PlayBar}>
      <button type="button" className={styles.Previous}>
        ◄◄
      </button>
      <button type="button" className={styles.Play}>
        ►
      </button>
      <button type="button" className={styles.Next}>
        ►►
      </button>
    </div>
  );
}

export default PlayBar;
