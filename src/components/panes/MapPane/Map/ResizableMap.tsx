import React, { ReactElement } from "react";
import useResizeAware from "react-resize-aware";

interface ResizableMapProps {
  children: ReactElement;
}

/***
 * A map that'll safely resize to it's parents bounds
 */
export default function ResizableMap(props: ResizableMapProps) {
  const [resizeComponent, containerSize] = useResizeAware();
  const element: ReactElement = props.children as any;
  const mapStyle = Object.assign(
    {},
    {
      width: containerSize.width,
      height: containerSize.height,
      position: "absolute"
    },
    element.props.style
  );
  const clone = React.cloneElement(element, {
    key: containerSize.width + containerSize.height,
    style: mapStyle
  });
  return (
    <>
      {resizeComponent}
      {clone}
    </>
  );
}
