import { useEffect, useRef, useState } from "react";

export default function useBounds() {
  const featuresRef = useRef(null);
  const [bounds, setBounds] = useState();
  useEffect(() => {
    if (featuresRef.current) {
      const featureBounds = (featuresRef.current as any).leafletElement.getBounds();
      setBounds(featureBounds);
    }
  }, [featuresRef.current]);

  return [featuresRef, bounds];
}
