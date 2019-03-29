import React from "react";
import styles from "./YouTube.module.css";

interface YouTubeProps {
  title: string;
  src: string;
}

/***
 * A responsive youtube component
 */
function YouTube(props: YouTubeProps) {
  return (
    <div className={styles.Block}>
      <div className={styles.wrapper}>
        <iframe
          title={props.title}
          width="650"
          height="365"
          src={props.src}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen={true}
        />
      </div>
    </div>
  );
}

export default YouTube;
