import { format, isValid, parse } from "date-fns";
import React from "react";
import { connect } from "react-redux";
import { Site, StreamInfo } from "../../../../api/types";
import {
  getCurrentSiteAudio,
  getFocusedSite,
  getFocusedTimeSegment,
  getTimeOfDay
} from "../../../../state/selectors";
import { State, TimeSegment } from "../../../../state/types";
import DayIndicator from "./DayIndicator";
import HabitatIcon from "./HabitatIcon/HabitatIcon";
import HabitatPhoto from "./HabitatPhoto";
import styles from "./InfoBar.module.css";
import LocationLabel from "./LocationLabel";
import MapAttribution from "./MapAttribution";

interface InfoBarProps {
  focusedTimeSegment: TimeSegment;
  focusedSite: Site | null;
  currentSiteAudio: StreamInfo | null;
  time: string;
}

function InfoBarView(props: InfoBarProps) {
  const site = props.focusedSite || ({} as Site);
  const streamInfo = props.currentSiteAudio || ({} as StreamInfo);
  const date = parse(`${streamInfo.date}T${streamInfo.time}`);
  const valid = isValid(date);

  return (
    <div className={styles.InfoBar}>
      <HabitatPhoto />
      <div className={styles.ForestInfo}>
        <h2>
          <HabitatIcon habitat={site.habitat} /> {site.habitat}
        </h2>
        <LocationLabel focusedSite={props.focusedSite} />
      </div>
      <div className={styles.Time}>
        <div className={styles.tooltip}>
          <h2>{props.time}</h2>
          {valid && <span>Recorded {format(date, "Do MMM YYYY")}</span>}
        </div>
        <DayIndicator timeSegment={props.focusedTimeSegment} />
      </div>
      <MapAttribution />
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    focusedTimeSegment: getFocusedTimeSegment(state),
    focusedSite: getFocusedSite(state),
    currentSiteAudio: getCurrentSiteAudio(state),
    time: getTimeOfDay(state)
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
