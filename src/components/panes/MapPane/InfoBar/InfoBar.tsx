import { format, isValid, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import api from "../../../../api/api";
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
import styles from "./InfoBar.module.css";

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
  const habitatPhoto = useHabitatPhoto(props.focusedTimeSegment, props.focusedSite);

  return (
    <div className={styles.InfoBar}>
      <HabitatIcon habitat={site.habitat} />
      <div className={styles.ForestInfo}>
        {!habitatPhoto && <h2>{site.habitat}</h2>}
        {habitatPhoto && (
          <div className={styles.tooltip}>
            <h2>{site.habitat}</h2>
            <img
              src={habitatPhoto}
              alt={`The ${props.focusedSite && props.focusedSite.habitat} habitat at ${
                props.focusedTimeSegment
              } o'clock`}
            />
            <link rel="preload" as="image" href={habitatPhoto} />
          </div>
        )}
        <p>{site.short_desc || `Information about ${site.habitat} here`}</p>
      </div>
      <div className={styles.Time}>
        <div className={styles.tooltip}>
          <h2>{props.time}</h2>
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
