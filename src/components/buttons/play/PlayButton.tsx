import React from "react";
import useResizeAware from "react-resize-aware";
import styles from "./PlayButton.module.css";

// adapted from https://codepen.io/aralon/pen/NqGWXZ

interface PlayButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  paused: boolean;
  backgroundColor: string;
}

function PlayButton(props: PlayButtonProps) {
  const [resizeListener, { width }] = useResizeAware();
  const { paused, backgroundColor, ...remainingProps } = props;
  const pausedClass = props.paused ? styles.paused : "";

  const triangleStyles = {
    borderRightColor: backgroundColor,
    borderTopWidth: width / 2,
    borderBottomWidth: width / 2,
    borderRightWidth: width
  };

  return (
    <button type="button" className={`${styles.PlayButton} ${pausedClass}`} {...remainingProps}>
      {resizeListener}
      <div className={styles.left} />
      <div className={styles.right} />
      <div className={styles.triangleA} style={triangleStyles} />
      <div className={styles.triangleB} style={triangleStyles} />
    </button>
  );
}

export default PlayButton;
