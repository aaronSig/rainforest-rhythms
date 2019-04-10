import React from "react";
import styles from "./HeroImage.module.css";

interface HeroImageProps {
  src: string;
  title: string;
}

function HeroImage(props: HeroImageProps) {
  return (
    <div className={styles.Container}>
      <div className={styles.HeroImage} style={{ backgroundImage: `url(${props.src})` }} />
      <h1 className={styles.Title}>{props.title}</h1>
    </div>
  );
}

export default HeroImage;
