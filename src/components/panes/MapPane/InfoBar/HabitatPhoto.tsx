import React, { useEffect, useState } from "react";
import ImageZoom from "react-medium-image-zoom";
import { connect } from "react-redux";
import api from "../../../../api/api";
import { Site } from "../../../../api/types";
import { setLightboxPhoto } from "../../../../state/actions";
import { getFocusedSite, getFocusedTimeSegment } from "../../../../state/selectors";
import { State, TimeSegment } from "../../../../state/types";
import styles from "./HabitatPhoto.module.css";

interface HabitatPhotoProps {
  focusedTimeSegment: TimeSegment;
  focusedSite: Site | null;
  showHabitatPhoto: (url: string, alt: string) => void;
}

function HabitatPhotoView(props: HabitatPhotoProps) {
  const habitatPhoto = useHabitatPhoto(props.focusedTimeSegment, props.focusedSite);
  const { focusedSite, focusedTimeSegment } = props;

  return (
    <ImageZoom
      image={{
        className: styles.HabitatPhoto,
        src: habitatPhoto!,
        alt: `${focusedSite ? focusedSite.habitat : "Habitat"} at ${focusedTimeSegment}`
      }}
    />
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

const mapStateToProps = (state: State) => {
  return {
    focusedTimeSegment: getFocusedTimeSegment(state),
    focusedSite: getFocusedSite(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    showHabitatPhoto: (url: string, alt: string) => {
      dispatch(setLightboxPhoto(url, alt));
    }
  };
};

const HabitatPhoto = connect(
  mapStateToProps,
  mapDispatchToProps
)(HabitatPhotoView);

export default HabitatPhoto;
