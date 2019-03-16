import React, { useEffect, useState } from "react";

/***
 * Plucks the timestamp from the url and passes it in as a prop.
 *
 * Will validate and pass null if the timestamp isn't numeric or no audioId is supplied
 */
export default function withTimestamp(WrappedComponent: any) {
  return function Timestamp(props: any) {
    const [timestamp, setTimestamp] = useState(undefined as undefined | null | number);
    useEffect(() => {
      const url = new URL(window.location.href);
      if (props.audioId && url.searchParams.has("t")) {
        const val = (url.searchParams.get("t") || "").trim() as any;
        if (!isNaN(val)) {
          setTimestamp(parseFloat(val));
          return;
        }
      }
      setTimestamp(null);
    }, [window.location.href, props.audioId]);

    if (timestamp === undefined) {
      // prevents a race condition with the timestamp appearing
      // as null
      return null;
    }

    return <WrappedComponent {...props} timestamp={timestamp} />;
  };
}
