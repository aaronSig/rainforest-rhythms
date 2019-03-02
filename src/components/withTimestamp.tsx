import React, { useEffect, useState } from "react";

/***
 * Plucks the timestamp from the url and passes it in as a prop.
 *
 * Will validate and pass null if the timestamp isn't numeric or no audioId is supplied
 */
export default function withTimestamp(WrappedComponent: any) {
  return function Timestamp(props: any) {
    const [timestamp, setTimestamp] = useState(null as null | number);
    useEffect(() => {
      const url = new URL(window.location.href);
      if (props.audioId && url.searchParams.has("t")) {
        const val = (url.searchParams.get("t") || "").trim() as any;
        if (!isNaN(val)) {
          setTimestamp(parseInt(val));
        }
      }
    }, []);

    return <WrappedComponent {...props} timestamp={timestamp} />;
  };
}
