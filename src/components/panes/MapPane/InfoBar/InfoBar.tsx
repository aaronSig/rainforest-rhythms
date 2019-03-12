import React from "react";
import { connect } from "react-redux";
import { Site } from "../../../../api/types";
import moon from "../../../../icons/moon.svg";
import sun from "../../../../icons/sun.svg";
import { getFocusedSite } from "../../../../state/selectors";
import { State } from "../../../../state/types";
import styles from "./InfoBar.module.css";

interface InfoBarProps {
  focusedSite: Site | null;
}

function InfoBarView(props: InfoBarProps) {
  const site = props.focusedSite || ({} as Site);
  return (
    <div className={styles.InfoBar}>
      <div className={styles.ForestInfo}>
        <h2>{site.habitat}</h2>
        <p>
          {site.short_desc ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        </p>
      </div>
      <div className={styles.Time}>
        <h2>{"09:40"}</h2>
        <img src={sun} alt="A sun icon symbolising day" />
        {false && <img src={moon} alt="A moon icon symbolising night" />}
      </div>
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    focusedSite: getFocusedSite(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const InfoBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoBarView);

export default InfoBar;
