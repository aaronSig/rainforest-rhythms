import Carousel from "nuka-carousel";
import React, { useState } from "react";
import { connect } from "react-redux";
import useResizeAware from "react-resize-aware";
import { Dispatch } from "redux";
import arrowLight from "../../../icons/arrow-light.svg";
import { State } from "../../../state/types";
import PlayButton from "../../buttons/play/PlayButton";
import styles from "./InfoPane.module.css";

interface InfoPaneProps {}

const items = [
  {
    name: "Little Spiderhunter",
    image: "/little-spiderhunter.png",
    scientificName: "Arachnothera longirostra"
  },
  {
    name: "Gorilla",
    image: "/little-spiderhunter.png",
    scientificName: "Gorilla longirostra"
  }
];

function InfoPaneView(props: InfoPaneProps) {
  const [paused, setPaused] = useState(true);
  const [resizeListener, sizes] = useResizeAware();
  const [slide, setSlide] = useState(0);

  function toggle() {
    setPaused(!paused);
  }

  function next() {
    if (slide + 1 === items.length) {
      setSlide(0);
    } else {
      setSlide(slide + 1);
    }
  }

  function previous() {
    if (slide - 1 === -1) {
      setSlide(items.length - 1);
    } else {
      setSlide(slide - 1);
    }
  }

  return (
    <section className={styles.InfoPaneContainer}>
      {resizeListener}
      <Carousel
        slideIndex={slide}
        afterSlide={slideIndex => setSlide(slideIndex)}
        withoutControls={true}
        wrapAround={true}
      >
        {items.map(i => (
          <div
            key={i.name}
            className={styles.InfoPane}
            style={{ backgroundImage: `url("${i.image}")`, height: sizes.height }}
          >
            <div className={styles.Controls}>
              <div className={styles.AudioButton} onClick={toggle}>
                <div>
                  <PlayButton paused={paused} backgroundColor={"#e23e1d"} />
                </div>
              </div>

              <button type="button" className={styles.SliderButton} onClick={previous}>
                <img className={styles.left} src={arrowLight} alt="Left Arrow" />
              </button>
              <div className={styles.InfoText}>
                <h1>{i.name}</h1>
                <h4>{i.scientificName}</h4>
              </div>
              <button type="button" className={styles.SliderButton} onClick={next}>
                <img src={arrowLight} alt="Right Arrow" />
              </button>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const InfoPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoPaneView);
export default InfoPane;
