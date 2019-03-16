import { useEffect, useRef } from "react";

/***
 * capture what a value looked like before it changed
 */
export default function usePrevious<T>(value: T, initial: T) {
  const ref = useRef(initial);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
