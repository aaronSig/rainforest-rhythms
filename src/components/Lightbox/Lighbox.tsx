import React, { memo, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { animated, useSpring } from "react-spring";
import { setLightboxPhoto } from "../../state/actions";
import { getLightboxImage, getLightboxImageAlt } from "../../state/selectors";
import { State } from "../../state/types";
import styles from "./Lightbox.module.css";

interface LightboxProps {
  imageUrl: string | undefined;
  imageAlt: string | undefined;

  reset: () => void;
}

function LightboxView(props: LightboxProps) {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(props.imageUrl); // this is needed so we don't lose the image before the animation has finished
  const cleanup = useCallback(() => {
    if (!visible) {
      setImage(undefined);
    }
  }, [visible, setImage]);

  const animatedOpacity = useSpring({
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? "auto" : "none",
    onRest: cleanup
  });

  const { imageUrl } = props;
  useEffect(() => {
    if (imageUrl) {
      setVisible(true);
      setImage(imageUrl);
    } else {
      setVisible(false);
    }
  }, [imageUrl, setImage]);

  return (
    <animated.div className={styles.Lightbox} style={animatedOpacity} onClick={props.reset}>
      <img alt={props.imageAlt} src={image} />
    </animated.div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    imageUrl: getLightboxImage(state),
    imageAlt: getLightboxImageAlt(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    reset: () => {
      dispatch(setLightboxPhoto(undefined, undefined));
    }
  };
};

const Lightbox = connect(
  mapStateToProps,
  mapDispatchToProps
)(LightboxView);

export default memo(Lightbox);
