import React from "react";
import styles from "./AudioControlPane.module.css";
import Timeline from "./Timeline";
import TimePicker from "./TimePicker";

export function AudioControlPane() {
  return (
    <section className={styles.AudioControlPane}>
      <TimePicker />
      <Timeline />
    </section>
  );
}
