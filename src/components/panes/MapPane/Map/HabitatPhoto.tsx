import React, { useEffect, useState } from "react";
import api from "../../../../api/api";
import { Site } from "../../../../api/types";
import { TimeSegment } from "../../../../state/types";
import styles from "./HabitatPhoto.module.css";

interface HabitatPhotoProps {
  focusedTimeSegment: TimeSegment;
  focusedSite: Site | null;
}

export default function HabitatPhoto(props: HabitatPhotoProps) {
  const habitatPhoto = useHabitatPhoto(props.focusedTimeSegment, props.focusedSite);
  return (
    <div className={styles.HabitatPhoto}>
      {habitatPhoto && habitatPhoto.length > 0 && (
        <img
          src={habitatPhoto}
          alt={`The ${props.focusedSite && props.focusedSite.habitat} habitat at ${
            props.focusedTimeSegment
          } o'clock`}
        />
      )}
    </div>
  );
}

// Fetches the photo for the habitiat at this time
function useHabitatPhoto(timeSegment: TimeSegment, site: Site | null) {
  const [photoUrl, setPhotoUrl] = useState(null as string | null);
  useEffect(() => {
    if (!site) {
      return;
    }
    const decimalTime = parseInt(timeSegment);
    api.sites.imageUrl(decimalTime, site.id).then(url => {
      setPhotoUrl(url);
    });

    return () => {
      setPhotoUrl(null);
    };
  }, [site, timeSegment]);

  return photoUrl;
}
