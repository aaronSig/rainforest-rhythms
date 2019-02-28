import React from "react";
import styles from "./AudioControlPane.module.css";
import ProgressBar from "./components/ProgressBar";

export function AudioControlPane() {
  return (
    <section className={styles.AudioControlPane}>
      <ProgressBar />
      <div className={styles.Chunks}>
        {new Array(72).fill(0).map((_, i) => (
          <div key={i} className={styles.Chunk} />
        ))}
      </div>
    </section>
  );
}
