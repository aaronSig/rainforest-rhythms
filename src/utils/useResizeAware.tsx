import React, { ReactNode, useCallback, useMemo, useState } from "react";
import ResizeListener from "./ResizeListener";

interface Sizes {
  width: null | number;
  height: null | number;
}

export default function useResizeAware(): [ReactNode, Sizes] {
  const [sizes, setSizes] = useState({
    width: null,
    height: null
  } as Sizes);

  const onResize = useCallback(ref => {
    let width = null as null | number;
    let height = null as null | number;

    if (ref.current) {
      width = ref.current!.offsetWidth as number;
      height = ref.current!.offsetHeight as number;
    }

    setSizes({
      width,
      height
    });
  }, []);

  const resizeListenerNode = useMemo(() => {
    return <ResizeListener onResize={onResize} />;
  }, [onResize]);

  return [resizeListenerNode, sizes];
}
