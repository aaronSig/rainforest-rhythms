import React from "react";
import styles from "./HeroImage.module.css";

interface HeroImageProps {
  src: string;
  title?: string;
  subtitle?: string;
}

function HeroImage(props: HeroImageProps) {
  return (
    <div className={styles.Container}>
      <div className={styles.HeroImage} style={{ backgroundImage: `url(${props.src})` }} />
      {props.title && <h1 className={styles.Title}>{props.title}</h1>}
      {props.subtitle && <h2 className={styles.Subtitle}> {props.subtitle}</h2>}
    </div>
  );
}

export default HeroImage;
