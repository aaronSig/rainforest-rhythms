import { useEffect, useRef, useState } from "react";

export default function useSize(): [
  React.MutableRefObject<any>,
  { width: number; height: number }
] {
  const ref = useRef(null as null | HTMLElement);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [_, setWindowSize] = useState({});

  useEffect(() => {
    const el = ref.current as HTMLElement;
    setWidth(el.clientWidth);
    setHeight(el.clientHeight);
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [ref, { width, height }];
}
