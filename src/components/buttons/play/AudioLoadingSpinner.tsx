// from http://tobiasahlin.com/spinkit/

import React from "react";
import useResizeAware from "react-resize-aware";
import styles from "./AudioLoadingSpinner.module.css";

export default function AudioLoadingSpinner() {
  const [resizeListener, { width, height }] = useResizeAware();

  return (
    <div className={styles.AudioLoadingSpinner} style={{ minWidth: width, minHeight: height }}>
      {resizeListener}
      <div className={`${styles.circle1} ${styles.circle}`} />
      <div className={`${styles.circle2} ${styles.circle}`} />
      <div className={`${styles.circle3} ${styles.circle}`} />
      <div className={`${styles.circle4} ${styles.circle}`} />
      <div className={`${styles.circle5} ${styles.circle}`} />
      <div className={`${styles.circle6} ${styles.circle}`} />
      <div className={`${styles.circle7} ${styles.circle}`} />
      <div className={`${styles.circle8} ${styles.circle}`} />
      <div className={`${styles.circle9} ${styles.circle}`} />
      <div className={`${styles.circle10} ${styles.circle}`} />
      <div className={`${styles.circle11} ${styles.circle}`} />
      <div className={`${styles.circle12} ${styles.circle}`} />
    </div>
  );
}
