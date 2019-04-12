import React from "react";
import { connect } from "react-redux";
import { setIntroShowing } from "../../state/actions";
import { getIntroShowing } from "../../state/selectors";
import { State } from "../../state/types";
import styles from "./Intro.module.css";

interface IntroProps {
  introShowing: boolean;
  close: () => void;
}

function IntroView(props: IntroProps) {
  if (!props.introShowing) {
    return null;
  }

  return (
    <div className={styles.IntroOverlay} onClick={props.close}>
      <div className={styles.IntroBox}>
        <p>
          The SAFE Project has been placing recording devices throughout the rainforest in Borneo.
          That audio is now available to listen to here.
        </p>
        <p>
          Try out listening to the dawn chorus starting at 6am when the animals are just waking. Or
          see if you can work out which of the animals you're hearing on the stream - we'll list
          animals that live in that area and could likely be around at that time. You may also be
          surprised to find out that from the sound alone you are able to hear differences between
          separate parts of the forest.
        </p>
        <p>We hope you enjoy exploring.</p>
        <br />
        <strong>
          <em>The SAFE Project Acoustics team</em>
        </strong>
      </div>
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    introShowing: getIntroShowing(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    close: () => {
      dispatch(setIntroShowing(false));
    }
  };
};

const Intro = connect(
  mapStateToProps,
  mapDispatchToProps
)(IntroView);

export default Intro;
