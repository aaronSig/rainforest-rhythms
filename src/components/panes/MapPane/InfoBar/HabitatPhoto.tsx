import React from "react";
import ImageZoom from "react-medium-image-zoom";
import { connect } from "react-redux";
import { Site, TimeSegment } from "../../../../api/types";
import { setLightboxPhoto } from "../../../../state/actions";
import { getFocusedSite, getFocusedTimeSegment } from "../../../../state/selectors";
import { State } from "../../../../state/types";
import styles from "./HabitatPhoto.module.css";

interface HabitatPhotoProps {
  focusedTimeSegment: TimeSegment;
  focusedSite: Site | null;
  showHabitatPhoto: (url: string, alt: string) => void;
}

function HabitatPhotoView(props: HabitatPhotoProps) {
  const { focusedSite, focusedTimeSegment } = props;

  let habitatPhoto: string | undefined = undefined;
  if (focusedSite) {
    if (focusedTimeSegment in focusedSite.photo) {
      habitatPhoto = focusedSite.photo[props.focusedTimeSegment];
    }
  }
  if (!habitatPhoto) {
    return null;
  }

  return (
    <ImageZoom
      image={{
        className: styles.HabitatPhoto,
        src: habitatPhoto,
        alt: `${focusedSite ? focusedSite.habitat : "Habitat"} at ${focusedTimeSegment}`
      }}
    />
  );
}

//

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
