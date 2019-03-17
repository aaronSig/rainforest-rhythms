import React from "react";
import useResizeAware from "react-resize-aware";
import AudioLoadingSpinner from "./AudioLoadingSpinner";
import styles from "./PlayButton.module.css";

// adapted from https://codepen.io/aralon/pen/NqGWXZ

interface PlayButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  paused: boolean;
  loading: boolean;
  backgroundColor: string;
  foregroundColor?: string;
  className?: string;
}

function PlayButton(props: PlayButtonProps) {
  const [resizeListener, { width }] = useResizeAware();
  const { paused, backgroundColor, loading, className, foregroundColor, ...remainingProps } = props;
  const playingClass = props.paused ? styles.playing : "";
  const loadingClass = props.loading ? styles.loading : "";

  const triangleStyles = {
    borderRightColor: backgroundColor,
    borderTopWidth: width / 2,
    borderBottomWidth: width / 2,
    borderRightWidth: width
  };

  const barStyles = {
    backgroundColor: foregroundColor || "#fff"
  };

  return (
    <button
      type="button"
      className={`${className} ${styles.PlayButton} ${playingClass} ${loadingClass}`}
      {...remainingProps}
    >
      {props.loading && <AudioLoadingSpinner />}

      {!props.loading && (
        <div className={styles.PlayButtonInner}>
          {resizeListener}
          <div className={styles.left} style={barStyles} />
          <div className={styles.right} style={barStyles} />
          <div className={styles.triangleA} style={triangleStyles} />
          <div className={styles.triangleB} style={triangleStyles} />
        </div>
      )}
    </button>
  );
}

export default PlayButton;
