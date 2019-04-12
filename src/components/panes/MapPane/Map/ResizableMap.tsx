import React, { ReactElement } from "react";
import useResizeAware from "../../../../utils/useResizeAware";

interface ResizableMapProps {
  children?: ReactElement;
}

/***
 * A map that'll safely resize to it's parents bounds
 */
export default function ResizableMap(props: ResizableMapProps) {
  const [resizeComponent, { width, height }] = useResizeAware();
  const element: ReactElement = props.children as any;
  const mapStyle = Object.assign(
    {},
    {
      width: width || 0,
      height: height || 0,
      position: "absolute"
    },
    element.props.style
  );

  // Key is needed to reload the map when the viewport changes
  const key = (width || 0) + (height || 0);
  const clone = React.cloneElement(element, {
    key,
    style: mapStyle,
    width,
    height
  });

  return (
    <>
      {width && height && clone}
      {resizeComponent}
    </>
  );
}
