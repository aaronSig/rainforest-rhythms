import { format, isValid, parse } from "date-fns";
import React from "react";
import { connect } from "react-redux";
import { Site, StreamInfo } from "../../../../api/types";
import {
  getCurrentSiteAudio,
  getFocusedSite,
  getFocusedTimeSegment
} from "../../../../state/selectors";
import { State, TimeSegment } from "../../../../state/types";
import DayIndicator from "./DayIndicator";
import styles from "./InfoBar.module.css";

interface InfoBarProps {
  focusedTimeSegment: TimeSegment;
  focusedSite: Site | null;
  currentSiteAudio: StreamInfo | null;
}

function InfoBarView(props: InfoBarProps) {
  const site = props.focusedSite || ({} as Site);
  const streamInfo = props.currentSiteAudio || ({} as StreamInfo);
  const date = parse(`${streamInfo.date}T${streamInfo.time}`);
  const valid = isValid(date);
  const time = valid ? format(date, "HH:mm") : props.focusedTimeSegment;
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
        <div className={styles.tooltip}>
          <h2>{time}</h2>
          {valid && <span>Recorded {format(date, "Do MMM YYYY")}</span>}
        </div>
        <DayIndicator timeSegment={props.focusedTimeSegment} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    focusedTimeSegment: getFocusedTimeSegment(state),
    focusedSite: getFocusedSite(state),
    currentSiteAudio: getCurrentSiteAudio(state)
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
