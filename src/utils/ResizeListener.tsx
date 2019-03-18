// adapted from https://github.com/FezVrasta/react-resize-aware
// to use an iframe instead of an object as it was throwing an error in FireFox

import React from "react";
import useOnResize from "./useOnResize";

const style = {
  display: "block",
  opacity: 0,
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: -1
} as any;

interface ListenerProps {
  onResize: (el: React.MutableRefObject<any>) => void;
}

function ResizeListener(props: ListenerProps) {
  const ref = React.useRef(null as null | HTMLIFrameElement);
  useOnResize(ref, () => props.onResize(ref));

  return (
    <iframe
      title="resize-listener"
      ref={ref}
      style={style}
      // data="about:blank"
      aria-hidden={true}
      tabIndex={-1}
      // type="text/html"
      aria-label="resize-listener"
    />
  );
}

export default ResizeListener;
