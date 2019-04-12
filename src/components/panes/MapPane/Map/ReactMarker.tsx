import { divIcon } from "leaflet";
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
//@ts-ignore
import { Marker, MarkerProps } from "react-leaflet";

interface ReactMarkerProps extends MarkerProps {
  // must be unique per marker
  id: string;
  [key: string]: any;
}
/***
 * A leaflet marker that can use a react node
 */
export default function ReactMarker(props: ReactMarkerProps) {
  const [container, setContainer] = useState(null as HTMLElement | null);

  const { id, icon, children, ...remaining } = props;
  const i = useMemo(() => {
    return divIcon({
      className: "MarkerContainer",
      html: `<div id="${id}" style="position: absolute;"></div>`
    });
  }, [id]);

  useEffect(() => {
    if (!container || container.id !== id) {
      setContainer(document.getElementById(`${id}`));
    }
  }, [container, id]);

  return (
    <>
      <Marker icon={i} {...remaining} />
      <Portal container={container}>{children}</Portal>
    </>
  );
}

function Portal(props: any) {
  if (!props.container) {
    return null;
  }

  // These divs position the child to the bottom center is over the
  // point we're marking
  return ReactDOM.createPortal(
    <>
      {/*
        use this div as a marker to find the point
       <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          backgroundColor: "pink"
        }}
      /> */}
      <div
        style={{
          position: "absolute",
          bottom: -5,
          left: 0,
          // get around a bug where the padding from the margin offset
          //prevents interacting with elements under
          // will mean that children will need to set pointer-events: auto;
          pointerEvents: "none"
        }}
      >
        <div
          style={{
            marginLeft: "-50%"
          }}
        >
          {props.children}
        </div>
      </div>
    </>,
    props.container
  );
}
